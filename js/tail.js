---
layout: null
---
$( document ).ready(function() {

  // enable bootstrap effecs
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

});
