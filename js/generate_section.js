/**
 * @file
 * Functionality dealing with generating the weights sections.
 */

/**
 * Generates the elements for an individual range.
 *
 * @param string section
 *   The machine name of the section this option belongs to.
 * @param string option
 *   The machine name of this option.
 * @param object option_data
 *   Data about this option, including its name, a possible description, and a
 *   possible default value.
 */
function generate_option_range(section, option, option_data) {
  // Container div for the option range.
  var option_range_div = document.createElement('div');
  option_range_div.className = 'option-range-group';
  // Title of the option range.
  var option_range_title = document.createElement('h5');
  option_range_title.className = 'card-title pb-n1';
  option_range_title.id = section + '--' + option + '--title';
  option_range_title.innerHTML = option_data['name'];
  // Row that the input and value go in.
  var option_range_input_row = document.createElement('div');
  option_range_input_row.className = 'row pb-n1';
  // Column div that the range element goes into.
  var option_range_input_column = document.createElement('div');
  option_range_input_column.className = 'col';
  // The actual input element.
  var option_range_input = document.createElement('input');
  option_range_input.type = 'range';
  option_range_input.className = 'form-control-range';
  option_range_input.id = section + '--' + option;
  if (option_data.hasOwnProperty('default')) {
    option_range_input.value = option_data['default'];
  }
  else {
    option_range_input.value = 0;
  }
  // The column div that the range value goes into.
  var option_range_input_value_div = document.createElement('div');
  option_range_input_value_div.className = 'col col-lg-2';
  // The span element displaying the range.
  var option_range_input_value = document.createElement('span');
  option_range_input_value.className = 'input-group-text';
  option_range_input_value.id = section + '--' + option + '--value';
  if (option_data.hasOwnProperty('default')) {
    option_range_input_value.innerHTML = option_data['default'];
  }
  else {
    option_range_input_value.innerHTML = '0';
  }
  // Ensure the option_range_input_value is updated as the slider goes.
  $(document).on('input', '#' + option_range_input.id, function() {
    $(option_range_input_value).html($(this).val());
  });
  // Compile the elements together.
  option_range_div.appendChild(option_range_title);
  option_range_div.appendChild(option_range_input_row);
  option_range_input_row.appendChild(option_range_input_column);
  option_range_input_row.appendChild(option_range_input_value_div);
  option_range_input_column.appendChild(option_range_input);
  option_range_input_value_div.appendChild(option_range_input_value);
  // Possibly add a description below.
  if (option_data.hasOwnProperty('description')) {
    var option_range_description = document.createElement('small');
    option_range_description.id = section + '--' + option + '--description';
    option_range_description.className = 'form-text text-muted help-text pb-4';
    option_range_description.innerHTML = option_data['description'];
    option_range_div.appendChild(option_range_description);
  }
  // Add a line break.
  return option_range_div;
}

/**
 * Generates an individual weights section with range elements.
 *
 * @param string section
 *   The machine name of this section.
 * @param object section_data
 *   Data about this section, including a name, group, description, and options.
 *
 * @return element
 *   Element object representing this option section.
 */
function generate_section(section, section_data) {
  // Section div.
  var section_div = document.createElement('div');
  section_div.id = section;
  section_div.className = "section-group";
  // Section title element.
  var title = document.createElement('h4');
  title.id = section + '-title';
  title.className = "card-title section-title";
  title.innerHTML = section_data['name'];
  section_div.appendChild(title);
  // Section description.
  var description = document.createElement('p');
  description.id = section + '-description';
  description.className = "card-text help-text";
  description.innerHTML = section_data['description'];
  section_div.appendChild(description);
  // Section options.
  for (var option in section_data['options']) {
    section_div.appendChild(generate_option_range(section, option, section_data['options'][option]));
  }
  // Add a nice spacer at the bottom of each section.
  section_div.appendChild(document.createElement('hr'));

  return section_div;
}
