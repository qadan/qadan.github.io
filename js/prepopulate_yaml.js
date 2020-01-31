/**
 * @file
 * Pre-populate the form with existing YAML.
 */

/**
 * Attempts to parse an existing YAML document.
 *
 * @param File file
 *   A file object.
 */
async function parse_existing_yaml(file) {
	var yaml = await file.text();
	try {
	  return jsyaml.safeLoad(yaml);
	}
	catch (e) {
		pop_bad_weights_modal('Something went wrong loading this YAML file; try fixing it or use a different one?');
	}
}

/**
 * Helper to get the integer form of a value.
 *
 * @param mixed value
 *   Something to try to turn into an integer.
 *
 * @return int
 *   The number, if it was parsed, or 0.
 */
function get_int(value) {
	var as_int = parseInt(value);
	if (typeof as_int == 'number') {
	  return as_int;
	}
	return 0;
}

/**
 * Runs through a list of weights, using them to prepopulate the form.
 *
 * @param object weights
 *   Parsed YAML weights object.
 */
function prepopulate_form(weights) {
	for (section in weights) {
		if (section != 'rom') {
			for (option in weights[section]) {
				var as_int = get_int(weights[section][option]);
				if (document.getElementById(section + '--' + option) != null) {
				  document.getElementById(section + '--' + option).value = as_int;
				  document.getElementById(section + '--' + option + '--value').innerHTML = as_int;
				}
			}
		}
	}
	for (section in weights['rom']) {
		for (option in weights['rom'][section]) {
			var as_int = get_int(weights['rom'][section][option]);
			document.getElementById(section + '--' + option).value = as_int;
			document.getElementById(section + '--' + option + '--value').innerHTML = as_int;
		}
	}
	if (weights.hasOwnProperty('description')) {
		document.getElementById('yaml-description').value = weights['description'];
	}
}

/**
 * Adds the drag-and-drop event listeners for existing YAML.
 */
function add_drop_event_listener() {
  var drop_zone = document.getElementById('yaml-drop-zone');

  drop_zone.ondrop = function(e) {
  	e.preventDefault();
  	this.className = 'card mx-auto text-white bg-dark';
  	document.getElementById('yaml-filename').value = e.dataTransfer.files[0].name;
  	parse_existing_yaml(e.dataTransfer.files[0]).then(function(yaml) {
  	  if (yaml) {
  		  prepopulate_form(yaml);
  			document.getElementById('drag-and-drop-text').innerHTML = "You can drag another YAML file here to re-populate the form.";
  	  }
  	  else {
  	  	document.getElementById('drag-and-drop-text').innerHTML = "Drag and drop an existing weights YAML here to pre-populate the form.";
  	  }
  	});
  };

  drop_zone.ondragover = function() {
  	this.className = 'card mx-auto bg-light';
  	document.getElementById('drag-and-drop-text').innerHTML = "Drop weights YAML here."
  	return false;
  };

  drop_zone.ondragleave = function() {
  	this.className = 'card mx-auto text-white bg-dark';
  	document.getElementById('drag-and-drop-text').innerHTML = "Drag and drop an existing weights YAML here to pre-populate the form.";
  	return false;
  };
}

/**
 * Enables the drop zone if drag and drop is supported.
 */
function enable_drop_zone() {
	if ('FileReader' in window) {
		document.getElementById('yaml-drop-zone').style.display = 'flex';
		add_drop_event_listener();
	}
}