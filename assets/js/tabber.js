---
layout: null
---
// Constants.
const tabsDict = {{ site.features.actions.versioning.tabbers | jsonify }}

// Variables.
var selectingTabs = false;

/**
 * Process a tab click and activate all the tabs related to the clicked one.
 */
function tabClicked(tabLink) {
    if (selectingTabs)
      return;

    selectingTabs = true;

    // Get all the tab links.
    var tabsLinks= document.querySelectorAll('.nav-tabs a');
    // Get all the tab items.
    var tabs = document.querySelectorAll('.tab-item');
    // Get the class of the tabs to be shown.
    var tabsClass = tabLink.className.replace('link-', '');

    // Activate all the tab links.
    for(i = 0; i < tabsLinks.length; i++) {
      var newTabLink = tabsLinks[i];
      var tabParent = newTabLink.parentNode;
      if (tabLink.className == newTabLink.className
        && tabParent.className.indexOf("active") === -1)
        tabParent.className += " active";
      else if (tabLink.className != newTabLink.className)
        tabParent.className = tabParent.className.replace(/\bactive\b/g, "");
    }

    // Activate all the tabs.
    for(i = 0; i < tabs.length; i++) {
      var newTab = tabs[i];
      if (tabLink.hash.indexOf(newTab.name) !== -1) {
        newTab.className += " in";
        newTab.className += " active";
      } else {
        newTab.className = newTab.className.replace(/\bin\b/g, "");
        newTab.className = newTab.className.replace(/\bactive\b/g, "");
      }
    }
    selectingTabs = false;
};

/**
 * Convert the div blocks configured with 'tabber-panel' class into Bootstrap
 * tabs structures so they are displayed as tab controls.
 *
 * For more info: https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp
 */
$(function() {
  // Get all the tabbed blocks of the page.
  $(".tabber-panel").each(function() {
    var classes = $(this).attr("class").split(" ");
    classes.forEach(function callback(value, index) {
      tabberName = value.match(/^tabs-([a-z_\-]+)/)
      console.log(tabberName)
    });
    // Get the content div of each tabbed block.
    $(this).children("td.openblock > .content").each(function() {

      // Set the proper class to the content so it is processed as a tabs container.
      $(this).className += " tabber-content";

      // Create the tabs panel control.
      var tabTitles = document.createElement('ul');
      tabTitles.className += " nav";
      tabTitles.className += " nav-tabs";
      // Process all the tabs for the tabber panel.
      var tabDivs = tabContent.getElementsByClassName("tabber-item");
      for (j = tabDivs.length - 1; j >= 0; j--) {
        // Update style of each tab content div.
        var tabDiv = tabDivs[j];
        tabDiv.className += " tab-pane";
        tabDiv.className += " fade";
        if (j == tabDivs.length - 1) {
            tabDiv.className += " in";
            tabDiv.className += " active";
        }

        // Get the name of the tab.
        var tabClassName = tabDiv.className.split(" ")[2];
        var tabName = tabsDict[tabClassName];
        if (tabName == null)
            tabName = tabClassName.split('_').join(' ');

        // Create the corresponding tab control for the tab content.
        var tabTitle = document.createElement('li');
        if (j == tabDivs.length - 1)
            tabTitle.className += " active";
        // Create the link for the tab control.
        var tabLink = document.createElement('a');
        tabLink.className = "link-" + tabClassName;
        tabLink.href = "#" + tabClassName;
        tabDiv.name = tabClassName;
        tabLink.onclick = function () { tabClicked(this); };
        var tabText = document.createTextNode(tabName);
        tabLink.appendChild(tabText);

        // Add the link to the tab control.
        tabTitle.appendChild(tabLink);

        // Add the tab control to the tabs panel.
        tabTitles.appendChild(tabTitle);
      };

      // Insert the tabs panel control above the tab content div.
      //tabbedElements[i].insertBefore(tabTitles, tabContent);
    });
  });
});
