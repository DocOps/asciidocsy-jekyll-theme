---
layout: null
---
// Constants.
const tabsDict = {{ site.features.actions.versioning.tabsets | jsonify }}

// Variables.
// var selectingTabs = false;
//
// /**
//  * Process a tab click and activate all the tabs related to the clicked one.
//  */
// function tabClicked(tabLink) {
//     if (selectingTabs)
//       return;
//
//     selectingTabs = true;
//
//     // Get all the tab links.
//     var tabsLinks= document.querySelectorAll('.nav-tabs a');
//     // Get all the tab items.
//     var tabs = document.querySelectorAll('.tab-item');
//     // Get the class of the tabs to be shown.
//     var tabsClass = tabLink.className.replace('link-', '');
//
//     // Activate all the tab links.
//     for(i = 0; i < tabsLinks.length; i++) {
//       var newTabLink = tabsLinks[i];
//       var tabParent = newTabLink.parentNode;
//       if (tabLink.className == newTabLink.className
//         && tabParent.className.indexOf("active") === -1)
//         tabParent.className += " active";
//       else if (tabLink.className != newTabLink.className)
//         tabParent.className = tabParent.className.replace(/\bactive\b/g, "");
//     }
//
//     // Activate all the tabs.
//     for(i = 0; i < tabs.length; i++) {
//       var newTab = tabs[i];
//       if (tabLink.hash.indexOf(newTab.name) !== -1) {
//         newTab.className += " in";
//         newTab.className += " active";
//       } else {
//         newTab.className = newTab.className.replace(/\bin\b/g, "");
//         newTab.className = newTab.className.replace(/\bactive\b/g, "");
//       }
//     }
//     selectingTabs = false;
// };

/**
 * Convert the div blocks configured with 'tabber-' classes into Bootstrap
 * tabs structures so they can be treated as Bootstrap tab controls.
 *
 * For more info: https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp
 */
$( document ).ready(function() {
  // Get all the tabbed blocks of the page.
  $(".tabber-tabset").each(function() {
    $(this).addClass("container")
    var classes = $(this).attr("class").split(" ");
    for (let i = 0; i < classes.length; ++i) {
      if (classes[i] !== null) {
        if (classes[i].match(/^tabs-([a-z_\-]+)/)) {
          var tabberName = classes[i].replace("tabs-","");
          break;
        };
      };
    };
    var tabSet = tabsDict[tabberName]['swap']['opts'];
    var theseTabs = [];
    // Loop through the tabs determining name and contents
    $(this).prepend('<ul class="nav nav-tabs" role="tablist"></ul>')
    // Get each tabbed panel
    $(this).find('.tabber-item').each(function() {
      var classes = $(this).attr("class").split(" ");
      for (let i = 0; i < classes.length; ++i) {
        if (classes[i] !== null) {
          if (classes[i].match(/^tab-([a-z_\-]+)/)) {
            var tabName = classes[i].replace("tab-","");
            break;
          };
        };
      };
      if (tabSet !== null) {
        // use a match from the tabSet to affix labevar tabLabel = ;
        var tabLabel = tabSet.find(opt => {
          return opt.slug == tabName
        }).text;
      };
      $(this).wrap('<div class="tab-pane ' + tabName + '-pane fade" role="tabpanel"></div>')
      // use the caption IF there is one
      $(this).children('caption.title').each(function() {
        var tabLabel = $(this).html();
        $(this).remove()
      });
      if (tabLabel == null || tabLabel == "") {
        var tabLabel = tabName.replace("-"," ");
      }
      $(this).parent().parent('.content')
      .addClass("tab-content").siblings('.nav.nav-tabs')
      .append('<li class="nav-item"><a href=".' + tabName + '-pane" class="nav-link" data-toggle="tab" role="tab" aria-selected="false">' + tabLabel + '</a></li>')
      $(this).parent().parent('.content').siblings('.nav.nav-tabs').find('.nav-item:first-child a').addClass("active").attr("aria-selected","true")
      $(this).parent().parent().find('.tab-pane:first-child').addClass("show active")
    });
  });
});
