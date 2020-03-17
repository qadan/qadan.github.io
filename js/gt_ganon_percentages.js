/**
 * @file
 * Generates a GT/Ganon odds section.
 */

/**
 * Creates a div that updates GT/Ganon crystal odds.
 */
function generate_gt_ganon_percentages_table() {
  // Create a percentages section.
  var group_element = document.getElementById(get_group_id_from_name('Goals'));
  var percentages_element = document.createElement('div');
  percentages_element.id = 'gt-ganon-percentages';
  group_element.appendChild(percentages_element)
  // Add a description.
  var percentages_description = document.createElement('p');
  percentages_description.className = 'card-text help-text';
  percentages_description.innerHTML = "In a race, knowing the odds that you can enter Ganon's tower before being able to defeat Ganon can be important in making large-scale routing decisions. This table shows, with the current configuration of Ganon's Tower Required Crystals and Ganon Vulnerable Required Crystals, what the odds are that the required crystals will be the same, that Ganon's Tower will require more crystals, or that Ganon will require more crystals.";
  percentages_element.appendChild(percentages_description);
  // Generate the table.
  var percentages_table = document.createElement('table');
  percentages_table.className = 'table';
  percentages_element.appendChild(percentages_table);
  // Add the header.
  var header = document.createElement('thead');
  var header_row = document.createElement('tr'); // lol turtle rock
  var header_cell_name = document.createElement('th');
  header_cell_name.scope = 'col';
  header_cell_name.innerHTML = 'Odds Type';
  header_row.appendChild(header_cell_name);
  var header_cell_percentage = document.createElement('th');
  header_cell_percentage.scope = 'col';
  header_cell_percentage.innerHTML = 'Odds';
  header_row.appendChild(header_cell_percentage);
  header.appendChild(header_row);
  // Add the body.
  var table_body = document.createElement('tbody');
  percentages_table.appendChild(table_body);
  // Add the GT Requires More Crystals row.
  var gt_requires_more = document.createElement('tr');
  var gt_requires_more_label = document.createElement('th');
  gt_requires_more_label.scope = 'row';
  gt_requires_more_label.innerHTML = 'GT Requires More Crystals:';
  gt_requires_more.appendChild(gt_requires_more_label);
  var gt_requires_more_percentage = document.createElement('td');
  gt_requires_more_percentage.id = 'gt-requires-more-percentage';
  gt_requires_more.appendChild(gt_requires_more_percentage);
  table_body.appendChild(gt_requires_more);
  // Add the Requirements Are Equal row.
  var requirements_are_equal = document.createElement('tr');
  var requirements_are_equal_label = document.createElement('th');
  requirements_are_equal_label.scope = 'row';
  requirements_are_equal_label.innerHTML = 'Crystal Requirements Are Equal:';
  requirements_are_equal.appendChild(requirements_are_equal_label);
  var requirements_are_equal_percentage = document.createElement('td');
  requirements_are_equal_percentage.id = 'requirements-are-equal-percentage';
  requirements_are_equal.appendChild(requirements_are_equal_percentage);
  table_body.appendChild(requirements_are_equal);
  // Add the Ganon Requires More row.
  var ganon_requires_more = document.createElement('tr');
  var ganon_requires_more_label = document.createElement('th');
  ganon_requires_more_label.scope = 'row';
  ganon_requires_more_label.innerHTML = 'Ganon Requires More Crystals:';
  ganon_requires_more.appendChild(ganon_requires_more_label);
  var ganon_requires_more_percentage = document.createElement('td');
  ganon_requires_more_percentage.id = 'ganon-requires-more-percentage';
  ganon_requires_more.appendChild(ganon_requires_more_percentage);
  table_body.appendChild(ganon_requires_more);

  populate_gt_ganon_percentages();
  attach_gt_ganon_percentages_updaters();
}

/**
 * Gets probabilities for each crystal requirement, factoring in 'random'.
 *
 * @param string group_id
 *   The ID of the crystal requirement group to get the computed weights for.
 *
 * @return array
 *   A list of computed crystal probabilities from 0 to 7.
 */
function get_computed_crystal_probabilities(group_id) {
  var raw_weights = [
    parseInt(document.getElementById(group_id + '--0--value').innerText),
    parseInt(document.getElementById(group_id + '--1--value').innerText),
    parseInt(document.getElementById(group_id + '--2--value').innerText),
    parseInt(document.getElementById(group_id + '--3--value').innerText),
    parseInt(document.getElementById(group_id + '--4--value').innerText),
    parseInt(document.getElementById(group_id + '--5--value').innerText),
    parseInt(document.getElementById(group_id + '--6--value').innerText),
    parseInt(document.getElementById(group_id + '--7--value').innerText),
  ];
  var crystal_weights_random = parseInt(document.getElementById(group_id + '--random--value').innerText);
  var raw_weights_sum = raw_weights.reduce((a, b) => a + b, 0);
  if (crystal_weights_random > 0) {
    crystal_weights_random = crystal_weights_random / (raw_weights_sum + crystal_weights_random);
    var weights_odds = (raw_weights_sum / 8) * crystal_weights_random;
    for (var weight in raw_weights) {
      raw_weights[weight] += weights_odds;
    }
    raw_weights_sum = raw_weights.reduce((a, b) => a + b, 0);
  }
  probabilities = [];
  for (var i in raw_weights) {
    probabilities[i] = raw_weights[i] / raw_weights_sum;
  }

  return probabilities;
}

/**
 * Calculates the odds of crystal requirement differences for GT/Ganon.
 *
 * @return object
 *   Associative array pairing the IDs of cells to update with percentages.
 */
function calculate_gt_ganon_percentages() {
  var ganons_tower_probabilities = get_computed_crystal_probabilities('tower_open');
  var ganon_probabilities = get_computed_crystal_probabilities('ganon_open');

  percentages = {
    'gt-requires-more-percentage': 0,
    'requirements-are-equal-percentage': 0,
    'ganon-requires-more-percentage': 0,
  };

  for (var i = 1; i < 8; i++) {
    var gt_more_coefficient = 0;
    for (var j = 0; j < i; j++) {
      gt_more_coefficient += ganons_tower_probabilities[j];
    }
    percentages['gt-requires-more-percentage'] += (ganon_probabilities[i] * gt_more_coefficient) * 100;
    percentages['requirements-are-equal-percentage'] += (ganon_probabilities[i] * ganons_tower_probabilities[i]) * 100;
  }
  for (var i = 1; i < 7; i++) {
    var ganon_more_coefficient = 0;
    for (var j = i; j < 7; j++) {
      ganon_more_coefficient += ganons_tower_probabilities[j];
    }
    percentages['ganon-requires-more-percentage'] += (ganon_probabilities[i] * ganon_more_coefficient) * 100;
  }

  return percentages;
}

/**
 * Populates the GT/Ganon percentages table with new values.
 */
function populate_gt_ganon_percentages() {
  var percentages = calculate_gt_ganon_percentages();
  for (var percentage in percentages) {
    document.getElementById(percentage).innerHTML = percentages[percentage].toFixed(2) + '%';
  }
}

/**
 * Attaches percentage updating listeners to the crystal requirement sliders.
 */
function attach_gt_ganon_percentages_updaters() {
  var sliders_affected = [
    '#tower_open--random',
    '#ganon_open--random',
  ];
  for (i = 0; i < 8; i++) {
    sliders_affected.push('#tower_open--' + i);
    sliders_affected.push('#ganon_open--' + i);
  }
  for (input in sliders_affected) {
    $(document).on('input', sliders_affected[input], function() {
      populate_gt_ganon_percentages()
    });
  }
}