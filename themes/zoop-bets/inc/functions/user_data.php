<?php

if (is_user_logged_in()) {

// Register the script
wp_register_script( 'userData', get_bloginfo('template_url').'/assets/js/menu.js' );

$current_user = wp_get_current_user();
$user = get_user_meta($current_user->ID);

// Localize the script with new data
$translation_array = array(
  // 'user' => $user,
  'user_bankroll' => $user['bankroll'][0],
  'user_kellystake' => $user['kellystake'][0],
  'user_maxstake' => $user['maxstake'][0],
);
wp_localize_script( 'userData', 'user_settings', $translation_array );

// Enqueued script with localized data.
wp_enqueue_script( 'userData' );

}