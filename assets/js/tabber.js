---
layout: null
---
/**
 * Convert the div blocks configured with 'tabber-' classes into Bootstrap
 * tab/pane structures so they can be treated as Bootstrap tab controls.
 *
 * See:
   * https://getbootstrap.com/docs/4.3/components/navs/#javascript-behavior
   * https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp
 */
/**
Liquid generate JSON object of version handlers block
**/
{% assign handlers = site.data.theme.versioning.handlers %}
const tabSets = {
  {% for ts in handlers %}
    {% if ts[1].verb == "tab" %}
    "{{ts[0]}}": {{ ts[1] | jsonify }}
    {% endif %}
  {% endfor %}
}

/**
Custom jQuery functions
**/
// Get the name of a tabset, tab, or pane based on this current element class
jQuery.fn.getNameByClass = function() {
  var classes = this.attr("class").split(" ");
  for (let i = 0; i < classes.length; ++i) {
    if (classes[i] !== null) {
      var nameClass = classes[i]
       .match(/^((tabs|pane|item|link)\-)([a-z_\-0-9]+$)/)
      if (nameClass != null) {
        return classes[i].replace(nameClass[0],nameClass[3]);
        break;
      };
    };
  };
};

/**
Document ready
**/
$( document ).ready(function() {
  // Get all the tabbed blocks of the page
  $(".tabber-tabset").each(function() {
    $(this).addClass("container")
    var tabberName = $(this).getNameByClass()
    var tabSet = tabSets[tabberName]['swap']['opts'];
    $(this).prepend('<ul class="nav nav-tabs list-' + tabberName + '" role="tablist"></ul>')
    // Get each tabbed pane
    $(this).find('.tabber-pane').each(function() {
      var tabName = $(this).getNameByClass()
      var tabLabel = tabName.replace("-"," ")
      $(this).wrap('<div class="tab-pane pane-' + tabName + ' fade" role="tabpanel"></div>')
      if (tabSet !== null) {
        // use a match from the tabSet to affix labevar tabLabel = ;
        tabEntry = tabSet.find(opt => {
          return opt.slug == tabName
        });
        if (typeof tabEntry !== "undefined" && tabEntry['text'] !== null) {
          tabLabel = tabEntry['text']
        }
      };
      // use the caption IF there is one
      $(this).find('.title').each(function() {
        tabLabel = $(this).html();
        $(this).remove()
      });
      $(this).parent().parent('.content')
      .addClass("tab-content").siblings('.nav.nav-tabs')
      .append('<li class="nav-item item-' + tabName + '"><a href=".pane-' + tabName + '" class="nav-link link-' + tabName + '" data-toggle="tab" role="tab" aria-selected="false">' + tabLabel + '</a></li>')
    });
    // establish defaults
    var pick = tabSets[tabberName]['swap']['pick'];
    var nochoice = false;
    if ( urlParams.has(tabberName) ) {
      var val = urlParams.get(tabberName)
    } else if ( $.cookie(tabberName) ) {
      var val = $.cookie(tabberName)
    } else if ( typeof tabSets[tabberName]['swap']['pick'] !== 'undefined' ) {
      var val = tabSets[tabberName]['swap']['pick']
    }
    // fallback selection in case default/chosen is not a tab/pane in this tabber
    $('.tabber-tabset .nav-item:first-child .nav-link').each( function() {
      $(this).tab('show')
      $('.pane-' + $(this).getNameByClass() ).each( function() {
        $(this).addClass("active show").siblings().removeClass("active show")
      });
    });
    // now load the defaults that do exist
    $('.item-' + val + ' .link-' + val).each( function() {
      $(this).tab('show')
    });
    $('.pane-' + val ).each( function() {
      $(this).addClass("active show").siblings().removeClass("active show")
    });
    $.cookie(tabberName, val)
  });
  // additional actions on any tab click event
  $('.tabber-tabset a[data-toggle="tab"]').on('click', function () {
    var href = $(this).attr("href")
    $('.tabber-tabset a[href="' + href + '"]').not($(this)).tab('show')
    $(href).addClass("active show").siblings().removeClass("active show")
    $.cookie(
      $(this).parent().parent().parent().getNameByClass()
      ,$(this).getNameByClass()
    )
  })
});
