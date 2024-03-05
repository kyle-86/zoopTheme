<?php 

function save_user_settings() {
  if (isset($_POST['user-settings-nonce']) && wp_verify_nonce($_POST['user-settings-nonce'], 'user-settings')) {
      $user_id = get_current_user_id();

      $bankroll   = sanitize_text_field($_POST['bankroll']);
      $kellystake = sanitize_text_field($_POST['kellystake']);
    //   $maxstake   = sanitize_text_field($_POST['maxstake']);

      update_user_meta($user_id, 'bankroll', $bankroll);
      update_user_meta($user_id, 'kellystake', $kellystake);
    //   update_user_meta($user_id, 'maxstake', $maxstake);

      // Optionally, you can add a success message or redirect the user to another page.
  }
}
add_action('template_redirect', 'save_user_settings');


function set_default_user_metadata($user_id) {
  // Check if it's a new user registration
  if (is_wp_error($user_id)) {
      return;
  }

  // Define default values for your fields
  $default_bankroll = 1000;
  $default_kellystake = 0.2;
  $default_maxstake = 5;

  // Get the user data for the newly registered user
  $user = get_userdata($user_id);

  // Check if the fields are empty, and set the default values
  if (empty(get_user_meta($user_id, 'bankroll', true))) {
      update_user_meta($user_id, 'bankroll', $default_bankroll);
  }
  if (empty(get_user_meta($user_id, 'kellystake', true))) {
      update_user_meta($user_id, 'kellystake', $default_kellystake);
  }
  if (empty(get_user_meta($user_id, 'maxstake', true))) {
      update_user_meta($user_id, 'maxstake', $default_maxstake);
  }
}

add_action('user_register', 'set_default_user_metadata');