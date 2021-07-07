---
---
/**
Prepares content for toggling and executes toggle functionality
**/
$( document ).ready(function() {
  {% assign handlers = site.data.theme.versioning.handlers %}
  const toggleSets = {
    {%- for ts in handlers %}
      {%- if ts[1].verb == "toggle" %}
      "{{ts[0]}}": {{ ts[1] | jsonify }}
      {%- endif %}
    {%- endfor %}
  }
  var togglesList = [];
  // hide all elements with a switcher-managed class
  $('.toggle-handler input').each(function () {
    var theClass = $("." + $(this).val());
    $(theClass).hide();
  });
  function toggleButton () {
    console.log($(this).parent())
    var thisToggle = $(this).parent().parent().attr('name');
    var $thisInput = $(this)
    var thisVal    = $thisInput.val();
    var activeClass = "." + thisVal;
    $(this).parent().siblings().each( function() {
      $( '.' +  $(this).find('input').val() ).hide();
    });
    $(activeClass).show();
    $.cookie(thisToggle, thisVal);
  }
  $('.toggle-handler input').on('focus', toggleButton)
  $('.toggle-handler').each( function() {
    var thisToggle = $(this).attr('name')
    var pick = toggleSets[thisToggle]['swap']['pick']
    // Prepare inititial activation, if any
    if ( urlParams.has(thisToggle) ) {
      var val = urlParams.get(thisToggle)
    } else if ( $.cookie(thisToggle) ) {
      var val = ($.cookie(thisToggle))
    } else if ( pick != '' && typeof pick !== 'undefined' ) {
      var val = pick
    } else {
      var val = $(this).find('input:first-child').val()
    }
    $(this).find('input[value="' + val + '"]').click()
  });
  // focus event
});
