/**
 * Handler for clicking the 'Reset Burger Profile' button.
 */
$("#reset-burger-profile").click(function() {
  var canDelete = confirm("Are you sure you want to reset your burger profile?");
  if (canDelete) {
    localStorage.clear();
    resetMap();
  }
});

/**
 * Handler for clicking the 'Import Burger Profile' button.
 */
$('#import-burger-profile-link').click(function(e) {
  e.preventDefault();
  $('#import-burger-profile-input').trigger('click');
  $('#import-burger-profile-input').change(function() {
    var file = this.files[0];
    read = new FileReader;
    try {
      read.readAsBinaryString(file);
      read.onloadend = function() {
        var json = JSON.parse(read.result);
        localStorage.clear();
        markers.splice(0, markers.length);
        $.each(json, function(index, value) {
          localStorage[index] = value;
        });
      }
      initialize(window.map.getCenter(), window.map.getZoom());
      alert("Successfully imported burger profile!");
    }
    catch(e) {
      alert("Uploaded file is not valid!");
    }
  });
});

/**
 * Handler for clicking the 'Export Burger Profile' button.
 */
$('#export-burger-profile').click(function(e) {
  e.preventDefault();
  var storage_output = JSON.stringify(localStorage);
  var download = document.createElement('a');
  download.setAttribute('href', 'data:application/json,' + encodeURIComponent(storage_output));
  download.setAttribute('download', 'burger_profile.json');
  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    download.dispatchEvent(event);
  }
  else {
    download.click();
  }
});

/**
 * Handler for clicking the 'Toggle Geolocated Position' button.
 */
$('#toggle-geolocated-position').click(function(e) {
  e.preventDefault();
  if (localStorage['geolocated_position_status'] === 'off') {
    window.geolocated_marker.setMap(window.map);
    $("#toggle-geolocated-position-icon").removeClass("glyphicon-remove-circle").addClass("glyphicon-ok-circle");
    localStorage['geolocated_position_status'] = "on";
  }
  else {
    window.geolocated_marker.setMap(null);
    $("#toggle-geolocated-position-icon").removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
    localStorage['geolocated_position_status'] = "off";
  }
});

/**
 * Handler for clicking the 'Toggle Clustering' button.
 */
$("#toggle-clustering").click(function(e) {
  e.preventDefault();
  if (localStorage['enable_clustering'] === 'true') {
    localStorage['enable_clustering'] = 'false';
    $("#toggle-clustering-icon").removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
  }
  else {
    localStorage['enable_clustering'] = 'true';
    $("#toggle-clustering-icon").removeClass("glyphicon-removeClass-circle").addClass("glyphicon-ok-circle");
  }
  resetMap();
});
