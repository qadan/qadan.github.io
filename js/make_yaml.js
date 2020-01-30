/**
 * @file
 * Functionality dealing with turning the document into a .yaml file.
 */

/**
 * Gets the value for an element by ID.
 *
 * @param string id
 *   The element ID.
 * @param bool cast_to_int
 *   Whether to attempt to give back an actual integer.
 *
 * @return string|int|null
 *   The value for the element, or null if not set.
 */
function get_value(id, cast_to_int = true) {
  var element = document.getElementById(id);
  if (element.value) {
    if (cast_to_int) {
      return parseInt(element.value);
    }
    return element.value;
  }
}

/**
 * Gets the placeholder for an element by ID.
 *
 * @param string id
 *   The element ID.
 *
 * @return string
 *   The value of the placeholder; an empty string if not set.
 */
function get_placeholder(id) {
  var element = document.getElementById(id);
  if (element.placeholder) {
    return element.placeholder;
  }
  return '';
}

/**
 * Gets a weights object from the current values in the document.
 *
 * @return object
 *   A weights object structured as a weights .yaml should be.
 */
function get_weights_object_from_document() {
  var weights_object = {
    'description': get_value('yaml-description', false) || get_placeholder('yaml-description'),
    'rom': {
    },
  };

  // Iterate through weights sections.
  var weights_data = get_weights_data();
  for (var section in weights_data) {
    var weights = {};
    for (option in weights_data[section]['options']) {
      weights[option] = get_value(section + '--' + option);
    }
    if (weights_data[section]['group'] == 'ROM Settings') {
      weights_object['rom'][section] = weights;
    }
    else {
      weights_object[section] = weights;
    }
  }

  return weights_object;
}

/**
 * Converts a weights object to YAML.
 *
 * @param object weights
 *   An object containing weights as they should be structured into YAML.
 *
 * @return string
 *   A .yaml string of weights.
 */
function convert_weights_to_yaml(weights) {
  try {
    return jsyaml.safeDump(weights);
  }
  catch (e) {
    pop_bad_weights_modal('Nice try; get that garbage out of your YAML metadata.');
  }
}

/**
 * Validates that there are no sections with all 0 weights.
 *
 * @param object weights
 *   Weights object not yet converted to YAML.
 *
 * @return bool
 *   Assertion of validation.
 */
function validate_weights(weights) {
  for (section in weights) {
    if (section != 'rom') {
      var sum = 0;
      for (option in weights[section]) {
        sum += weights[section][option];
      }
      if (sum == 0) {
        pop_bad_weights_modal('All the values are 0 in the ' + section + ' section; at least one option needs to be greater than 0.');
        return false;
      }
    }
  }
  return true;
}

/**
 * Creates and hides a modal telling the user they hecked up their weights.
 */
function create_bad_weights_modal() {
  // Modal.
  var modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'bad-weights-modal';
  modal.role = 'dialog';
  modal.tabindex = '-1';
  modal.setAttribute('aria-hidden', 'true');
  document.body.appendChild(modal);
  // Modal document element.
  var modal_document = document.createElement('div');
  modal_document.className = 'modal-dialog';
  modal_document.role = 'document';
  modal.appendChild(modal_document);
  // Modal content element.
  var modal_content = document.createElement('div');
  modal_content.className = 'modal-content';
  modal_document.appendChild(modal_content);
  // Modal header section.
  var modal_header = document.createElement('div');
  modal_header.className = 'modal-header';
  modal_content.appendChild(modal_header);
  // Modal header title.
  var modal_title = document.createElement('h5');
  modal_title.className = 'modal-title';
  modal_title.innerHTML = 'Error';
  modal_header.appendChild(modal_title);
  // Modal body section.
  var modal_body = document.createElement('div');
  modal_body.className = 'modal-body';
  modal_content.appendChild(modal_body);
  // Paragraph with our message.
  var modal_message = document.createElement('p');
  modal_message.id = 'bad-weights-modal-message';
  modal_message.innerHTML = '';
  modal_body.appendChild(modal_message);
  // Modal footer.
  var modal_footer = document.createElement('div');
  modal_footer.className = 'modal-footer';
  modal_content.appendChild(modal_footer);
  // Close button.
  var modal_close_button = document.createElement('button');
  modal_close_button.type = 'button';
  modal_close_button.className = 'btn btn-secondary';
  modal_close_button.setAttribute('data-dismiss', 'modal');
  modal_close_button.innerHTML = 'Close';
  modal_footer.appendChild(modal_close_button);
}

/**
 * Sets the message for the bad weights modal, then pops it.
 *
 * @param string message
 *   The message to set in the modal.
 */
function pop_bad_weights_modal(message = 'Something went wrong trying to generate the YAML file.') {
  document.getElementById('bad-weights-modal-message').innerHTML = message;
  var popper = document.createElement('a');
  popper.setAttribute('data-toggle', 'modal');
  popper.setAttribute('data-target', '#bad-weights-modal');
  popper.style.display = 'none';
  document.body.appendChild(popper);
  popper.click();
  document.body.removeChild(popper);
}

/**
 * Normalizes a YAML filename, ensuring a .yaml or .yml extension.
 *
 * @return string
 *   Filename for the YAML file.
 */
function get_yaml_filename(value) {
  var filename_value = get_value('yaml-filename', false) || get_placeholder('yaml-filename');
  if (filename_value.substring(filename_value.length - 5) != '.yaml' || filename_value.substring(filename_value.length - 4) != '.yml') {
    filename_value = filename_value + '.yaml';
  }
  return filename_value;
}

/**
 * Callback for the YAML generating event button.
 */
function on_get_yaml_click() {
  var weights = get_weights_object_from_document();
  if (validate_weights(weights) && validate_weights(weights['rom'])) {
    var yaml = convert_weights_to_yaml(weights);
    var download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(yaml));
    download.setAttribute('download', get_value('yaml-filename', false) || get_placeholder('yaml-filename'));
    download.style.display = 'none';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }
}
