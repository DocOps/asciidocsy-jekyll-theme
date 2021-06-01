---
layout: null
---
// (function($) {
//     'use strict';
//
//     function bottomPos(element) {
//         return element.offset().top + element.outerHeight();
//     }
//     $(function() {
//         var promo = $(".js-td-cover");
//         if (!promo.length) {
//             return
//         }
//         var promoOffset = bottomPos(promo);
//         var navbarOffset = $('.js-navbar-scroll').offset().top;
//         var threshold = Math.ceil($('.js-navbar-scroll').outerHeight());
//         if ((promoOffset - navbarOffset) < threshold) {
//             $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
//         }
//         $(window).on('scroll', function() {
//             var navtop = $('.js-navbar-scroll').offset().top - $(window).scrollTop();
//             var promoOffset = bottomPos($('.js-td-cover'));
//             var navbarOffset = $('.js-navbar-scroll').offset().top;
//             if ((promoOffset - navbarOffset) < threshold) {
//                 $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
//             } else {
//                 $('.js-navbar-scroll').removeClass('navbar-bg-onscroll');
//                 $('.js-navbar-scroll').addClass('navbar-bg-onscroll--fade');
//             }
//         });
//     });
// }(jQuery));
// (function($) {
//     'use strict';
//     var Search = {
//         init: function() {
//             $(document).ready(function() {
//                 $(document).on('keypress', '.td-search-input', function(e) {
//                     if (e.keyCode !== 13) {
//                         return
//                     }
//                     var query = $(this).val();
//                     var searchPage = "{{ site.url }}{{ site.baseurl }}/search/?q=" + query;
//                     document.location = searchPage;
//                     return false;
//                 });
//             });
//         },
//     };
//     Search.init();
// }(jQuery));

$( document ).ready(function() {

  /**
  * controls the
  * term-popover effect
  **/
  // instantiate the Bootstrap JS
  if ($('.term').length) { // nothing happens if there are no terms on the page
    const termsDict = {{ site.data.terms | jsonify }}
    const icon      = '{{ site.semantics.inline.role.term.show.icon.text }}'
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
{% if site.semantics.inline.role.term.show.icon %}
  {% if site.semantics.inline.role.term.show.icon.tilt %}
    {% assign rotate = "fa-rotate-" | append: site.semantics.inline.role.term.show.icon.tilt %}
  {% endif %}
        $(this).append('<i class="icon ' + icon + ' {{rotate}}">');
{% endif %}
        $(this).attr('data-toggle', 'popover');
        $(this).attr('data-title', theTerm['term']);
        $(this).attr('data-content', asciidoctor.convert(theTerm['desc'], {doctype: 'inline'}));
{% if site.semantics.inline.role.term.show.icon.spin %}
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
  $('[data-toggle="popover"]').popover({
      placement : 'top',
      container : 'body',
      trigger   : 'hover',
      delay     : { "show": 300, "hide": 200 },
      html      : true
  });
  $('[data-toggle="tooltip"]').tooltip({
      placement : 'right',
      container : 'body',
      trigger   : 'hover',
      delay     : { "show": 300, "hide": 200 }
  });

  /**
  Prepare content for toggling
  **/
  // check for cookie and override default
  $('.toggle-handler').each(function () {
    if ($.cookie('switcher_' + $(this).attr('name'))) {
      var cookieVal = $.cookie('switcher_' + $(this).attr('name'));
      $(this).children('label').each(function () {
        $(this).removeClass('active');
      });
      $(this).children().find('input[value=' + cookieVal + ']').closest('label').addClass('active');
    };
  });
  var togglesList = [];
  // hide all elements with a switcher-managed class
  $('.toggle-handler input').each(function () {
    var theClass = $("." + $(this).val());
    if ($(theClass).length) { togglesList.push($(this).closest('.toggle-handler').attr('name')) }
    $(theClass).hide();
  });
  // hide switchers with no classes found
  $('.toggle-handler').hide();
  function uniq(value, index, self) {
    return self.indexOf(value) === index;
  }
  uToggles = togglesList.filter(uniq)
  for ( i in uToggles ) {
    $("div.toggle-handler[name=" + uToggles[i] + "]").show();
  };
  // show elements with the active class
  var activeElem = $('.toggle-handler label.active input').val();
  $("." + activeElem).show();

  // navgoco menu invocation and settings
  $('#subject-menu').navgoco({
      accordion: false,
      openClass: 'open',
      save: true,
      cookie: {
        name: 'navgoco',
        expires: false,
        path: '/'
      },
      slide: {
        duration: 400,
        easing: 'swing'
      }
  });

  /**
  * controls the
  * skin-changer
  * drop-down **/
  $(function(){
    if (!$.cookie('skin-style')) {
      $.cookie('skin-style', '{{ site.styles.skin.pick }}');
    }
    if ($.cookie('skin-style')) {
      var skinStyle = $.cookie('skin-style')
      var skinRef   = '{{ site.theme_dir }}/css/skins/' + skinStyle + '.css'
      $('#skin-style').attr("href", skinRef);
      $('select#skin-changer').val(skinStyle).change();
    };
    $('select#skin-changer').on('change', function () {
      var newSkin = '{{ site.theme_dir }}/css/skins/' + $(this).val() + '.css'
      $('#skin-style').attr("href", newSkin)
      $.cookie('skin-style', $(this).val());
    });
  });

  /**
  * controls the
  * syntax-style-changer
  * drop-down **/
  $(function(){
    if (!$.cookie('syntax-style')) {
      $.cookie('syntax-style', 'a11y-light');
    }
    if ($.cookie('syntax-style')) {
      var syntaxStyle = $.cookie('syntax-style')
      var syntaxRef   = '/css/syntax/hljs/' + syntaxStyle + '.css'
      $('#syntax-style').attr("href", syntaxRef);
      $('select#syntax-changer').val(syntaxStyle).change();
    };
    $('select#syntax-changer').on('change', function () {
      var newSyntax = '/css/syntax/hljs/' + $(this).val() + '.css'
      $('#syntax-style').attr("href", newSyntax)
      $.cookie('syntax-style', $(this).val());
    });
  });

  // Enable toggling of content with switchers
  $(function(){
    $('.toggle-handler input').focus(function () {
      // plant a cookie
      var switcherName = $(this).closest('div.toggle-handler').attr('name');
      $.cookie('switcher_' + switcherName, $(this).val());
      location.reload();
    });
  });

});
