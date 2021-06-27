---
layout: null
---
$( document ).ready(function() {
  /**
  * controls the
  * term-popover effect
  **/
  if ($('.term').length) { // nothing happens if there are no terms on the page
    const termsDict = {{ site.data.terms | jsonify }}
    const icon      = '{{ site.data.theme.semantics.inline.role.term.show.icon.text }}'
    var termsList   = []
    /**
    Scan content for terms and insert data- attrs for
     popovers
    **/
    const asciidoctor = Asciidoctor();
    $('.term').each(function() {
      var classes = $(this).attr('class').split(' ');
      if (classes.length > 1) {
        var theTerm = termsDict.find(t => t.slug == classes[1]);
      } else {
        var theTerm = termsDict.find(t => t.slug == $(this).html().toLowerCase().replace(' ','-'));
      };
      if (typeof theTerm !== 'undefined') {
        if (!termsList.find(t => t.slug == theTerm.slug)) {
          termsList.push(theTerm);
        };
  {% if site.data.theme.semantics.inline.role.term.show.icon %}
    {% if site.data.theme.semantics.inline.role.term.show.icon.tilt %}
      {% assign rotate = "fa-rotate-" | append: site.data.theme.semantics.inline.role.term.show.icon.tilt %}
    {% endif %}
        $(this).append('<i class="icon ' + icon + ' {{rotate}}">');
  {% endif %}
        $(this).attr('data-toggle', 'popover');
        $(this).attr('data-title', theTerm['term']);
        $(this).attr('data-content', asciidoctor.convert(theTerm['desc'], {doctype: 'inline'}));
  {% if site.data.theme.semantics.inline.role.term.show.icon.spin %}
        $(this).hover(
          function() {
            $(this).children('i').addClass('fa-spin')
          },
          function() {
            $(this).children('i').removeClass('fa-spin')
          });
  {% endif %}
      } else {
        $(this).attr('data-error', 'No term entry found');
      };
    });
    var termsListHTML = '<div class="h5 nav-title terms-nav">Terms in this topic:</div><ul class="page-terms-list nav-list">'
    termsList.forEach(function(item){
      termsListHTML += '<li class="list-item nav-item"><a href="/glossary/#' + item.slug + '">' + item.term + '</li>'
      });
    termsListHTML += '</ul>';
    $('#terms-listing').prepend(termsListHTML);
  };
});
