<?php

function enqueue_custom_scripts_and_styles()
{

	// Enqueue jQuery
	wp_enqueue_script('jquery');

	// Enqueue DataTables script
	wp_enqueue_script('dataTables-js', 'https://cdn.datatables.net/1.13.7/js/jquery.dataTables.js', array('jquery'), null, true);
	wp_enqueue_script('moment-scripts', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js', array(), null, true);
	
	wp_enqueue_script('bundle-js', get_template_directory_uri() . '/dist/scripts.js', array(), null, true);
	
	$current_user_id = get_current_user_id();
  wp_localize_script('bundle-js', 'currentUserId', $current_user_id);

	wp_localize_script('bundle-js', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));

	// Enqueue your bundled CSS file
	wp_enqueue_style('dataTables-styles', 'https://cdn.datatables.net/1.13.7/css/jquery.dataTables.css', array(), null, 'all');
	wp_enqueue_style('bundle-styles', get_template_directory_uri() . '/dist/styles.bundle.css', array(), null, 'all');
}

// Hook the function into the 'wp_enqueue_scripts' action
add_action('wp_enqueue_scripts', 'enqueue_custom_scripts_and_styles');

// Add ACF options page
if (function_exists('acf_add_options_page')) {
	acf_add_options_page(array(
		'page_title'    => 'Theme Settings',
		'menu_title'    => 'Theme Settings',
		'menu_slug'     => 'theme-settings',
		'capability'    => 'edit_posts',
		'redirect'      => false
	));
}

// Enable custom menu support
if (function_exists('register_nav_menus')) {
	register_nav_menus(
		array(
			'primary-menu' => __('Primary Menu'),
			// You can add more menus as needed
		)
	);
}

require_once get_template_directory() . '/inc/functions/bets.php';
require_once get_template_directory() . '/inc/functions/user_data.php';
require_once get_template_directory() . '/inc/functions/results.php';
require_once get_template_directory() . '/inc/functions/zoopBets.php';
require_once get_template_directory() . '/inc/page-blocks/settings/user-settings.php';