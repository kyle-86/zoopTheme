<?php

// Create new db table

function create_bets_table()
{
	global $wpdb;
	$table_name = $wpdb->prefix . 'user_bets';

	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE $table_name (
			id INT(11) NOT NULL AUTO_INCREMENT,
			user_id BIGINT(20) UNSIGNED NOT NULL,
			bet_teams VARCHAR(255) NOT NULL,
			bet_league VARCHAR(255) NOT NULL,
			bet_id BIGINT(20) UNSIGNED NOT NULL,
			bet_agency VARCHAR(255) NOT NULL,
			bet_value DECIMAL(10, 2) UNSIGNED NOT NULL,
			bet_betTeam VARCHAR(255) NOT NULL,
			bet_odds DECIMAL(10, 2) UNSIGNED NOT NULL,
			bet_sport VARCHAR(255) NOT NULL,
			bet_refrenceId VARCHAR(255) NOT NULL,
			bet_eventTime VARCHAR(255) NOT NULL,
			bet_line VARCHAR(255) NOT NULL,
			bet_betType VARCHAR(255) NOT NULL,
			bet_result VARCHAR(255) NOT NULL,
			betAmount DECIMAL(10, 2) UNSIGNED NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY user_post_unique (user_id, bet_id)
	) $charset_collate;";

	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
}
add_action('after_setup_theme', 'create_bets_table'); 

// Save bet to db

// Add this in your functions.php or in a custom plugin
add_action('wp_ajax_save_data_to_custom_table', 'save_data_to_custom_table');
add_action('wp_ajax_nopriv_save_data_to_custom_table', 'save_data_to_custom_table');

function save_data_to_custom_table() {
	global $wpdb;
	$table_name = $wpdb->prefix . 'user_bets';

	$data_to_save = array();

	$allowed_fields = array('ticketid', 'user_id', 'bet_teams', 'bet_league', 'bet_id', 'bet_agency', 'betAmount', 'bet_betTeam', 'bet_odds', 'bet_value', 'bet_sport', 'bet_refrenceId', 'bet_eventTime', 'bet_line', 'bet_betType');

	// Sanitize and validate data before saving
	foreach ($allowed_fields as $field) {
			if (isset($_POST['data_to_save'][$field])) {
					$data_to_save[$field] = sanitize_text_field($_POST['data_to_save'][$field]);
			}
	}

	// Log information to a file
	$log_file = WP_CONTENT_DIR . '/custom_table_log.txt';
	file_put_contents($log_file, print_r($data_to_save, true), FILE_APPEND);

	if (!empty($data_to_save['bet_id'])) {
    // Attempt to update the existing record
    $existing_bet = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $data_to_save['bet_id']));

    if ($existing_bet) {
        // Update the existing record and set bet_result to 0
        $wpdb->update($table_name, array('betAmount' => $data_to_save['betAmount']), array('id' => $data_to_save['bet_id']));
    } else {
        // If the bet_id doesn't exist, insert a new record
        $wpdb->insert($table_name, $data_to_save);
    }
} else {
    // If bet_id is not provided, insert a new record
    $wpdb->insert($table_name, $data_to_save);
}

	wp_die(); // This is required to terminate immediately and return a proper response
}


function get_custom_bet_data_by_id($data) {
	global $wpdb;
	$table_name = $wpdb->prefix . 'user_bets';

	// Get the ID from the request
	$id = $data['id'];

	// Construct the SQL query with a WHERE clause to filter by ID
	$query = $wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id);

	$result = $wpdb->get_results($query, ARRAY_A);

	if (empty($result)) {
			return new WP_REST_Response(array(), 404);
	}

	return new WP_REST_Response($result, 200);
}

function get_custom_bets_data($data) {
	global $wpdb;
	$table_name = $wpdb->prefix . 'user_bets';

	// Check if an ID parameter is provided
	$id = isset($data['id']) ? $data['id'] : null;

	// Construct the SQL query with or without the WHERE clause based on the ID
	$query = $id
			? $wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id)
			: "SELECT * FROM $table_name";

	$result = $wpdb->get_results($query, ARRAY_A);

	if (empty($result)) {
			return new WP_REST_Response(array(), 404);
	}

	return new WP_REST_Response($result, 200);
}

add_action('rest_api_init', function () {
	register_rest_route('zoop/v1', 'bets', array(
			'methods' => 'GET',
			'callback' => 'get_custom_bets_data',
	));

	register_rest_route('zoop/v1', 'bets/(?P<id>\d+)', array(
			'methods' => 'GET',
			'callback' => 'get_custom_bets_data',
	));
});

// Add this to your theme's functions.php or in a custom plugin
function delete_bet_data() {
	// Check if the user is logged in or has the necessary capabilities
	if (!current_user_can('manage_options')) {
			wp_send_json_error('Permission denied');
	}

	// Get the ID from the AJAX request
	$bet_id = isset($_POST['bet_id']) ? intval($_POST['bet_id']) : 0;

	// Validate the ID
	if ($bet_id <= 0) {
			wp_send_json_error('Invalid ID');
	}

	// Perform the deletion in your database table (replace 'user_data' with your actual table name)
	global $wpdb;
	$table_name = $wpdb->prefix . 'user_bets';

	$result = $wpdb->delete($table_name, array('id' => $bet_id));

	if ($result !== false) {
			wp_send_json_success('Record deleted successfully');
	} else {
			wp_send_json_error('Error deleting record');
	}
}

// Hook the AJAX action
add_action('wp_ajax_delete_bet_data', 'delete_bet_data');
add_action('wp_ajax_nopriv_delete_bet_data', 'delete_bet_data'); // Include this line if you want to allow non-logged-in users to delete (optional)


