/**
 * Init some globs! Mmm globs.
 */
var infoWindows = [];
var markers = [];
var api_url = "http://www.meatadata.info:8081";

/**
 * When our modal shows up, it should be centered on the screen instead of up
 * at the top.
 */
$('.modal').on('show.bs.modal', function() {
  $(this).find('.modal-dialog').css({
    'margin-top': function() {
      return -($(this).outerHeight() / 2);
    },
    'margin-left': function() {
      return -($(this).outerWidth() / 2);
    }
  });
});

var iw_css = {
  "top": "5%",
  "left": "6%"
}

/**
 * The infoWindow template. TODO: uhhhhhh ...
 */
var infowindow_template = '<div class="burger-info-window">\n' +
'  <p class="lead">\n' +
'    <a href="%restaurant_url%">%burger_name% - %restaurant_name%</a>\n' +
'  </p>\n' +
'  <ul id="tabs" class="nav nav-tabs" data-tabs="tabs">\n' +
'    <li role="presentation" class="active"><a href="#burger-tab" data-toggle="tab">Burger</a></li>\n' +
'    <li role="presentation"><a href="#ingredients-tab" data-toggle="tab">Ingredients</a></li>\n' +
'    <li role="presentation"><a href="#restaurant-tab" data-toggle="tab">Restaurant</a></li>\n' +
'  </ul>\n' +
'  <div id="tabs-content" class="tab-content">\n' +
'    <div class="tab-pane active" id="burger-tab">\n' +
'      <table class="table infowindow-table" frame=void>\n' +
'        <div class="burger-wrapper">\n' +
'          <tr>\n' +
'            <td colspan="2">\n' +
'              <h4><small>%burger_quote%</small></h4>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td rowspan="3">\n' +
'              <img class="img-thumbnail burger-image" src="burger_images/%url_suffix%.png">\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td class="button-link bordered-cell">\n' +
'              <h4><small><a target="_blank" href="http://peiburgerlove.ca/burger/%url_suffix%">View Burger</a></small></h4>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td class="button-link bordered-cell">\n' +
'              <h4><small><a target="_blank" href="http://peiburgerlove.ca/rate/%url_suffix%">Rate Burger</a></small></h4>\n' +
'            </td>\n' +
'          </tr>\n' +
'        </div>\n' +
'      </table>\n' +
'    </div>\n' +
'    <div class="tab-pane" id="ingredients-tab">\n' +
'      <table class="table infowindow-table" frame=void>\n' +
'        <tr><td>\n' +
'          %ingredients%\n' +
'        </td></tr>\n' +
'      </table>\n' +
'    </div>\n' +
'    <div class="tab-pane" id="restaurant-tab">\n' +
'      <table class="table infowindow-table" frame=void>\n' +
'        <tr>\n' +
'          <td>Address:</td>\n' +
'          <td>%address%</td>\n' +
'        </tr>\n' +
'        <tr>\n' +
'          <td>Phone Number:</td>\n' +
'          <td>%phone_number%</td>\n' +
'        </tr>\n' +
'        <tr>\n' +
'          <td>Hours of Operation:</td>\n' +
'          <td>%hours_of_operation%</td>\n' +
'        </tr>\n' +
'        <tr>\n' +
'          <td>Website:</td>\n' +
'          <td><a href="%restaurant_url%" target="_blank">Open in new tab</a></td>\n' +
'        </tr>\n' +
'      </table>\n' +
'    </div>\n' +
'  </div>\n' +
'  <script type="text/javascript">\n' +
'    jQuery(document).ready(function($) {\n' +
'      $("#tabs").tab();\n' +
'    });\n' +
'  </script>\n' +
'</div>'

/**
 * Gotta know what the progress bar is so we can mess with it in the future.
 */
window.progress_bar = document.getElementById('progress-bar');
window.progress_bar.setNewValue = function(new_value) {
  this.setAttribute('aria-valuenow', new_value);
  this.setAttribute('style', 'width: ' + new_value + '%;');
}

/**
 * Get the status of the open filter and initialize if unset.
 */
function initializeOpenFilter() {
  if ($.type(localStorage['open_filter']) !== "string") {
    localStorage['open_filter'] = "unset";
    $('#filter-toggle-open-icon').removeClass('glyphicon-remove-circle').addClass('glyphicon-ok-circle');
  }
  else {
    var icon_type = localStorage['open_filter'] === "unset" ? 'ok' : 'remove';
    $('#filter-toggle-open-icon').removeClass().addClass('glyphicon glyphicon-' + icon_type + '-circle');
  }
}

/**
 * Resets the map.
 *
 * Clears all map variables and runs the initializer.
 */
function resetMap() {
  if (typeof localStorage['geolocated_position_status'] === 'undefined') {
    localStorage['geolocated_position_status'] = 'off';
  }
  if (typeof localStorage['enable_clustering'] === 'undefined') {
    localStorage['enable_clustering'] = 'true';
  }
  for (i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  infoWindows = [];
  if (typeof window.marker_cluster !== 'undefined') {
    window.marker_cluster.clearMarkers();
    window.oms.clearMarkers();
  }
  if (typeof window.map === 'undefined') {
    if (navigator.geolocation) {
      $("#modal").modal({
        keyboard: false,
        backdrop: 'static'
      }).on('shown.bs.modal', function() {
        window.progress_bar.setNewValue('10');
        initialize();
      });
    }
    else {
      initialize();
    }
  }
  else {
    initialize(window.map.getCenter(), window.map.getZoom());
  }
}

/**
 * Loops through the coordinate JSON and makes markers.
 */
function setMarkers(coordinates) {
  initializeOpenFilter();
  var marker_index = 0;
  coordinates.forEach(function(restaurant) {
    if (localStorage['open_filter'] === "unset") {
      // Get some coords, make a marker.
      var coords = new google.maps.LatLng(restaurant['latitude'], restaurant['longitude']);
      var marker = new google.maps.Marker({
        position: coords,
        title: restaurant['name'],
        index: marker_index,
        restaurant_id: restaurant['id'],
        icon: 'marker_icons/marker.png',
      });
      // Put the marker on the map, and add it to the list of markers.
      marker.setMap(localStorage['open_filter'] === "unset" ? window.map : null);
      markers.push(marker);
      // Generate an infoWindow for this marker.
      var infoWindow = new google.maps.InfoWindow({
        maxWidth: 320,
        index: marker_index,
        restaurant_id: restaurant['id'],
        regenerateContent: function() {
          $.ajax({
            context: this,
            url: api_url + '/restaurant/' + restaurant['id'],
            type: 'GET',
            dataType: 'jsonp',
            success: function(data) {
              this.restaurant_info = data;
              $.ajax({
                context: this,
                url: api_url + '/burger/' + this.restaurant_info['burgers'][0],
                type: 'GET',
                dataType: 'jsonp',
                success: function(data) {
                  this.burger_info = data;
                  this.setContent(generateInfoWindowContent(this.restaurant_info, this.burger_info));
                  $('#tabs').tabCollapse();
                }
              });
            }
          });
        }
      });
      // Increase the marker index.
      marker_index++;
      // Add event listeners for the infoWindow.
      google.maps.event.addListener(infoWindow, 'domready', function() {
        $(".burger-image").attr('src', restaurant['image_path']);
      });
      // Add the infoWindow to the list of infoWindows.
      infoWindows.push([infoWindow, marker]);
    }
  });
}

/**
 * Initialization function for the map.
 *
 * Attempts to narrow down what things to re-initialize subsequent times.
 */
function initialize(initial_position, initial_zoom) {
  // Get the burger JSON and parse it.
  var endpoint = (typeof localStorage['open_filter'] !== undefined && localStorage['open_filter'] === 'set') ?
    '/coordinates/open' :
    '/coordinates';
  var params = (endpoint === '/coordinates/open' && typeof localStorage['offset_hours'] !== undefined) ?
    'offset=' + localStorage['offset_hours'] :
    'offset=0';
  $.ajax({
    url: api_url + endpoint,
    data: params,
    type: 'GET',
    dataType: 'jsonp',
    success: function(data) {
      // We store the map in window.map. If nothing is in there, that means this
      // is the first time we've loaded the map for this pageload.
      if (typeof window.map === 'undefined') {
        // If nothing else, the map zoom should be set to 9 to show all of PEI.
        var mapOptions = {
          zoom: 9
        };
        window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      }
      // Three cases for setting the initial position and zoom of the map.
      // First, if initialize() was called with a position and zoom, use them.
      if (typeof initial_position !== 'undefined' && typeof initial_zoom !== 'undefined') {
        window.map.setCenter(initial_position);
        setMarkers(data.coordinates);
        window.progress_bar.setNewValue('50');
        window.map.setZoom(initial_zoom);
      }
      else {
        pos = new google.maps.LatLng(
          46.5151303,
          -63.2609883
        );
        setMarkers(data.coordinates);
        window.progress_bar.setNewValue('50');
        window.map.setCenter(pos);
      };
      // Determine clustering if it's set.
      if (localStorage['enable_clustering'] === 'true') {
        $("#toggle-clustering-icon").removeClass().addClass("glyphicon glyphicon-ok-circle");
        // The marker clusterer takes care of the actual clustering using the
        // marker list.
        window.marker_cluster = new MarkerClusterer(window.map, markers, { maxZoom: 15 });
        // Then, the OMS attempts to make the clusters spider if they're too
        // close together.
        window.oms = new OverlappingMarkerSpiderfier(window.map);
        // We add listeners to the OMS to make the infoWindows come up. It takes
        // care of whether clicking opens an infoWindow or spiders markers.
        window.oms.addListener('click', function (marker, event) {
          closeInfoWindows();
          var iw = infoWindows[marker.index][0];
          iw.regenerateContent();
          window.map.panTo(offsetCenter(window.map, marker.getPosition(), 0, -250));
          iw.open(window.map, marker);
          $(".gm-style-iw").css(iw_css);
        });
        markers.forEach(function (marker) {
          window.oms.addMarker(marker);
        });
        window.progress_bar.setNewValue('100');
      }
      // If marker clustering is off, do up the infoWindows normally.
      else {
        $("#toggle-clustering-icon").removeClass().addClass("glyphicon glyphicon-remove-circle");
        infoWindows.forEach(function(iw) {
          google.maps.event.addListener(iw[1], 'click', function() {
            closeInfoWindows();
            iw[0].regenerateContent();
            iw[0].open(window.map, iw[1]);
            $(".gm-style-iw").css(iw_css);
          });
        });
        window.progress_bar.setNewValue('100');
      }
      window.setTimeout(function() {
        $('#modal').modal('hide');
      }, 700);

      if (navigator.geolocation && typeof localStorage['attempt_geolocation'] !== undefined && localStorage['attempt_geolocation'] !== 0) {
        var geolocate_options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };
        var geolocate_success = function(position) {
          var pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          window.geolocated_marker = new google.maps.Marker({
            position: pos,
          });
          if (localStorage['geolocated_position_status'] === 'on') {
            window.geolocated_marker.setMap(window.map);
          }
          $(".geolocated-position").each(function(index, object) {
            $(this).removeAttr('style');
          });
          window.map.panTo(pos);
          zoomSmoothlyWheee(window.map.getZoom(), 12);
          window.geolocated_coords = pos;
        };
        var geolocate_fail = function(error) {
          if (error.code == 1) {
            localStorage['attempt_geolocation'] = 0;
          }
        };
        navigator.geolocation.getCurrentPosition(geolocate_success, geolocate_fail, geolocate_options);
      }
    }
  });
}

/**
 * Offsets the given coordinates by X/Y pixels.
 */
function offsetCenter(map, coords, offset_x, offset_y) {
  // Get the map scale, and determine the bounds.
  var scale = Math.pow(2, map.getZoom());
  var nw = new google.maps.LatLng(
    map.getBounds().getNorthEast().lat(),
    map.getBounds().getSouthWest().lng()
  );
  // Get the projection to the coordinates.
  var world_centre = map.getProjection().fromLatLngToPoint(coords);
  // Determine the pixel offset.
  var pixel_offset = new google.maps.Point((offset_x/scale) || 0,(offset_y/scale) || 0);
  // Determine the new centre, and return the projection ro there.
  var new_world_centre = new google.maps.Point(
    world_centre.x - pixel_offset.x,
    world_centre.y + pixel_offset.y
  );
  return map.getProjection().fromPointToLatLng(new_world_centre);
}

/**
 * Quick helper to close all infoWindows, since none exists within Google Maps.
 */
function closeInfoWindows() {
  for (var i = 0; i < infoWindows.length; i++) {
    infoWindows[i][0].close();
  }
}

/**
 * Generates the content of an infoWindow using the parsed JSON.
 */
function generateInfoWindowContent(restaurant, burger) {
  var template = infowindow_template;
  console.log(restaurant);
  console.log(burger);
  single_mapped = {
    'burger_name': burger['name'],
    'restaurant_name': restaurant['name'],
    'burger_quote': burger['quote'],
    'id': restaurant['id'],
    'url_suffix': burger['url_suffix'],
    'restaurant_url': restaurant['website'],
    'phone_number': restaurant['phone_number'],
  }
  br_separated = {
    'address': JSON.parse(restaurant['address']),
    'hours_of_operation': JSON.parse(restaurant['hours_of_operation']),
  }
  $.each(single_mapped, function(index, value) {
    template = template.replace(new RegExp('%' + index + '%', 'g'), value);
  });
  $.each(br_separated, function(index, value) {
    template = template.replace('%' + index + '%', value.join('<br/>'));
  });
  // Splitting the ingredients into new table rows.
  formatted_ingredients = "";
  burger_ingredients = JSON.parse(burger['ingredients']);
  $.each(burger_ingredients['ingredients'], function(index, value) {
    formatted_ingredients += "<tr><td>" + value + "</td></tr>";
  });
  formatted_ingredients += "<tr><td>" + burger_ingredients['bun'] + "</td></tr>";
  template = template.replace('%ingredients%', formatted_ingredients);
  return template;
}

google.maps.event.addDomListener(window, 'load', resetMap);
