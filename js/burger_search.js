/**
 * Handler for submitting a burger search.
 */

$("#burger-search-submit").click(function(e) {
  e.preventDefault();
  var result_list = [];
  var search_value = $("#burger-search-field").val().toLowerCase();
  if (search_value !== window.search_value) {
    window.search_value = search_value;
    var search_split = search_value.split(' ');
    $.each(search_split, function(idx, value) {
      search_split[idx] = 'term=' + search_value;
    });
    var search_terms = search_split.join('&');
    $.ajax({
      url: api_url + "/search",
      type: 'GET',
      data: search_terms,
      dataType: 'jsonp',
      success: function(data) {
        window.result_list = data;
        if (window.result_list.length !== 0) {
          window.search_index = 0;
          coordinates = new google.maps.LatLng(window.result_list[window.search_index]['latitude'], window.result_list[window.search_index]['longitude']);
          window.map.setCenter(coordinates);
          zoomSmoothlyWheee(window.map.getZoom(), 21);
        }
        else {
          alert("No results found.");
        }
      }
    });
  }
  else {
    coordinates = new google.maps.LatLng(window.result_list[window.search_index]['latitude'], window.result_list[window.search_index]['longitude']);
    window.map.setCenter(coordinates);
    zoomSmoothlyWheee(window.map.getZoom(), 21);
  }
});

/**
 * Smooth-ish zoomer, plus a handler for if the zoom is right.
 */
function zoomSmoothlyWheee(current, target) {
  if (current >= target) {
    if (typeof window.result_list !== "undefined") {
      if ((window.result_list.length === 1 && window.search_index === 0) || window.result_list.length !== 1) {
        window.map.setCenter(offsetCenter(window.map, window.map.getCenter(), 0, -250));
        var cool_marker = markers.filter(function(marker) {
          return marker.restaurant_id === window.result_list[window.search_index]['id'];
        });
        closeInfoWindows();
        cool_info_window = infoWindows[cool_marker[0].index][0];
        cool_info_window.open(window.map, cool_marker[0]);
        cool_info_window.regenerateContent();
        if (window.search_index === window.result_list.length - 1 && window.result_list.length !== 1) {
          window.search_index = 0;
        }
        else {
          window.search_index++;
        }
      }
    }
    return;
  }
  zoomer = google.maps.event.addListener(window.map, 'zoom_changed', function(e) {
    google.maps.event.removeListener(zoomer);
    zoomSmoothlyWheee(current + 1, target);
  });
  setTimeout(function() { map.setZoom(current); }, 80);
}
