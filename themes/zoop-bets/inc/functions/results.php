<?php 

function update_bet_results_callback($request)
{
  global $wpdb;

  // Check if the request has the necessary data
  $reference_id = $request->get_param('refrenceId'); // Corrected parameter name
  $bet_result = $request->get_param('betResult'); // Corrected parameter name

  if (empty($reference_id) || empty($bet_result)) {
    return new WP_Error('missing_data', 'Reference ID or Bet Result is missing.', array('status' => 400));
  }

  // Perform the database update
  $table_name = $wpdb->prefix . 'user_bets';
  $updated = $wpdb->update(
    $table_name,
    array('bet_result' => $bet_result),
    array('bet_refrenceId' => $reference_id)
  );

  if ($updated !== false) {
    return array('message' => 'Bet result ' . $reference_id . ' updated successfully.', 'status' => 200);
  } else {
    return new WP_Error('update_failed', 'Failed to update bet result.', array('status' => 500));
  }
}

function custom_bet_results_endpoint() {
	$base_url = site_url('/zoop'); // Replace 'zoopBets' with the correct directory name

	register_rest_route('zoop/v1', '/update_bet_results/', array(
			'methods'  => 'POST',
			'callback' => 'update_bet_results_callback',
			// 'permission_callback' => function () {
			// 		return current_user_can('manage_options'); // Adjust the capability as needed
			// },
			'base' => $base_url, // Set the base URL for the endpoint
	));
}

add_action('rest_api_init', 'custom_bet_results_endpoint');
