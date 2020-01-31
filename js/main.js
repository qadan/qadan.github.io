/**
 * @file
 * Main functionality.
 */

/**
 * Gets the appropriate group ID name for a given group.
 *
 * @param string group
 *   The full group name.
 *
 * @return string
 *   The translated <div> ID for that group.
 */
function get_group_id_from_name(group) {
  return group.replace(" ", "-").toLowerCase();
}

/**
 * Sort the weights options list into groups.
 *
 * @param object weights
 *   The weights list as loaded from JSON.
 *
 * @return object
 *   Group-sorted weights.
 */
function sort_into_groups(weights) {
  sorted_weights = {};
  for (var weight in weights) {
    if (!sorted_weights.hasOwnProperty(weights[weight]['group'])) {
      sorted_weights[weights[weight]['group']] = {};
    }
    sorted_weights[weights[weight]['group']][weight] = weights[weight];
  }
  return sorted_weights;
}

/**
 * Populates the form with groups.
 */
function populate_groups() {
  var weights_data = sort_into_groups(get_weights_data());
  for (var group in weights_data) {
    // Create a group div card.
    var group_element = document.createElement('div');
    group_element.className = 'card bg-light';
    group_element.id = get_group_id_from_name(group);
    // Add the title to the card.
    var group_title = document.createElement('h4');
    group_title.className = 'card-header';
    group_title.innerHTML = group;
    group_title.id = group_element.id + '--title';
    $(group_title).on('click', function() {
      var collapse_element = '#' + this.id.substring(0, this.id.length - 5) + 'collapse';
      console.log(collapse_element);
      $(collapse_element).collapse('toggle');
    });
    group_element.appendChild(group_title);
    // Create the group body collapse container.
    var group_body_collapse_container = document.createElement('div');
    group_body_collapse_container.className = 'collapse show';
    group_body_collapse_container.id = group_element.id + '--collapse';
    group_element.appendChild(group_body_collapse_container);
    // Create the group body div.
    var group_body = document.createElement('div');
    group_body.className = 'card-body';
    group_body.id = group_element.id + '--body';
    group_body_collapse_container.appendChild(group_body);
    document.getElementById('weights-form').appendChild(group_element);
    document.getElementById('weights-form').appendChild(document.createElement('br'));
  }
}

/**
 * Populates the form groups with weights sections.
 */
function populate_sections() {
  var weights_data = get_weights_data();
  for (var section in weights_data) {
    var section_div = generate_section(section, weights_data[section]);
    var group = get_group_id_from_name(weights_data[section]['group']) + '--body';
    document.getElementById(group).appendChild(section_div);
  }
}

/**
 * Make a YAML metadata section.
 */
function populate_yaml_metadata_stuff() {
  var group_element = document.createElement('div');
  // Create a YAML metadata card.
  group_element.className = 'card';
  group_element.id = 'yaml-metadata';
  // Add a title.
  var group_title = document.createElement('h4');
  group_title.className = 'card-header';
  group_title.innerHTML = 'YAML Information';
  group_element.appendChild(group_title);
  // Add the form elements.
  var group_body = document.createElement('div');
  group_body.className = 'card-body';
  group_body.id = 'yaml-metadata--body';
  group_element.appendChild(group_body);
  // YAML Description label.
  var yaml_description_title = document.createElement('h5');
  yaml_description_title.className = 'card-title';
  yaml_description_title.innerHTML = 'YAML Description';
  group_body.appendChild(yaml_description_title);
  // YAML Description.
  var yaml_description = document.createElement('input');
  yaml_description.type = 'text'
  yaml_description.className = 'form-control';
  yaml_description.placeholder = 'Mystery weights YAML';
  yaml_description.id = 'yaml-description';
  group_body.appendChild(yaml_description);
  // YAML Description help text.
  var yaml_description_help_text = document.createElement('small');
  yaml_description_help_text.className = 'form-text text-muted';
  yaml_description_help_text.innerHTML = 'Enter a description that will be placed inside the YAML and displayed during seed generation.';
  group_body.appendChild(yaml_description_help_text);
  group_body.appendChild(document.createElement('br'));
  // YAML Filename label.
  var yaml_filename_title = document.createElement('h5');
  yaml_filename_title.className = 'card-title';
  yaml_filename_title.innerHTML = 'YAML Filename';
  group_body.appendChild(yaml_filename_title);
  // YAML Filename.
  var yaml_filename = document.createElement('input');
  yaml_filename.type = 'text'
  yaml_filename.className = 'form-control';
  yaml_filename.placeholder = 'weights.yaml';
  yaml_filename.id = 'yaml-filename';
  group_body.appendChild(yaml_filename);
  // YAML Filename help text.
  var yaml_filename_help_text = document.createElement('small');
  yaml_filename_help_text.className = 'form-text text-muted';
  yaml_filename_help_text.innerHTML = 'Enter a name for your YAML file.';
  group_body.appendChild(yaml_filename);
  document.getElementById('weights-form').appendChild(group_element);
  document.getElementById('weights-form').appendChild(document.createElement('br'));
}

/**
 * Jams a button on the bottom of the whole thing.
 */
function add_button() {
  var button_div = document.createElement('div');
  button_div.className = 'text-center';
  var button = document.createElement('button');
  button.type = 'button';
  button.id = 'make-yaml-button';
  button.className = 'btn btn-primary';
  button.innerHTML = 'Generate YAML File';
  button_div.appendChild(button);
  document.getElementById('weights-form').appendChild(button_div);
}

/**
 * Adds an event handler to the button to generate a .yaml file.
 */
function make_button_do_a_yaml() {
  $('#make-yaml-button').on('click', on_get_yaml_click);
}

/**
 * Runs through the process of generating the form and event handlers.
 */
function bootstrap_mystery_yaml_form() {
  populate_groups();
  populate_sections();
  populate_yaml_metadata_stuff();
  add_button();
  make_button_do_a_yaml();
  create_bad_weights_modal();
  enable_drop_zone();
}
