/**
 * Handler for popping the offset modal if we need to.
 */
$('#filter-toggle-closed').click(function(e) {
  if (typeof localStorage['open_filter'] === 'undefined' || localStorage['open_filter'] === 'unset') {
    var populated_offset = typeof localStorage['offset_hours'] === 'undefined' ? 0 : localStorage['offset_hours'];
    $('input#offset-hours').val(populated_offset);
    $('#filter-toggle-closed-modal').modal('show');
  }
  else {
    localStorage['open_filter'] = 'unset';
    $('#filter-toggle-closed-icon').removeClass().addClass('glyphicon glyphicon-ok-circle');
    resetMap();
  }
});

/**
 * Handler for setting a closed restaurant filter.
 */
$("#filter-toggle-closed-sumbit").click(function(e) {
  e.preventDefault();
  localStorage['offset_hours'] = $('input#offset-hours').val();
  if (localStorage['offset_hours'] === '') {
    localStorage['offset_hours'] = 0;
  }
  localStorage['open_filter'] = 'set';
  $('#filter-toggle-closed-icon').removeClass().addClass('glyphicon glyphicon-remove-circle');
  $('#filter-toggle-closed-modal').modal('hide');
  resetMap();
});
