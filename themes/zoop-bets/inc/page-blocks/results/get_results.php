<?php 

//Not finished

function create_results_table()
{
	global $wpdb;
	$table_name = $wpdb->prefix . 'user_results';

	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE $table_name (
			id INT(11) NOT NULL AUTO_INCREMENT,
			user_id BIGINT(20) UNSIGNED NOT NULL,
			total_bets BIGINT(20) UNSIGNED NOT NULL,
			winning_bets BIGINT(20) UNSIGNED NOT NULL,
			losing_bets BIGINT(20) UNSIGNED NOT NULL,
			total_waged DECIMAL(10,2) UNSIGNED NOT NULL,
			current_balance DECIMAL(10,2) UNSIGNED NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY user_post_unique (user_id, bet_id)
	) $charset_collate;";

	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
}
add_action('after_setup_theme', 'create_bets_table');