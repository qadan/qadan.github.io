/**
 * @file
 * Pre-populate the form with existing YAML.
 */

/**
 * Attempts to parse an existing YAML document.
 */
function parse_existing_yaml(file) {
  console.log(files);
}

/**
 * Adds the drag-and-drop event listeners for existing YAML.
 */
function add_drop_event_listener() {
  var drop_zone = document.getElementById('yaml-drop-zone');

  drop_zone.ondrop = function(e) {
    e.preventDefault();
    this.className = 'upload-drop-zone';
    var yaml = parse_existing_yaml(e.dataTransfer.files[0]);
    if (yaml) {
      prepopulate_form(yaml);
    }
  };

  drop_zone.ondragover = function() {
    this.className = 'upload-drop-zone drop';
    return false;
  };

  drop_zone.ondragleave = function() {
    this.className = 'upload-drop-zone';
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