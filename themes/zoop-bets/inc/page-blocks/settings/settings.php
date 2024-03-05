<?php
// Place this code at the beginning of the template file where you want to check if the user is logged in.

// Check if the user is not logged in
if (!is_user_logged_in()) {
    // Get the login page URL
    $login_url = wp_login_url();

    // Redirect the user to the login page
    wp_redirect($login_url);

    // Exit to prevent further execution
    exit;
}
?>

<section class="<?php echo $cleaned_layout_name; ?>__block settingsBlock mt-40 mb-40" data-type="resultedBets">
  <div class="container">
    <div class="row">

      <div class="col-lg-12">
      <div class="form-message filters_bar" style="display:none;">
        Settings have been updated.
      </div>
        <div class="content_area">
          <div id="userSettings" class="content-area">
            <main id="main" class="site-main" role="main">
              <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <div class="entry-content">
                  <?php
                  $user_id = get_current_user_id();
                  $bankroll = get_user_meta($user_id, 'bankroll', true);
                  $kellystake = get_user_meta($user_id, 'kellystake', true);
                  $maxstake = get_user_meta($user_id, 'maxstake', true);
                  ?>

                  <form id="user-settings" action="" method="post">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <div class="form-field">
                          <label for="bankroll">Bankroll:</label>
                          <input type="number" step="0.01" min="0" name="bankroll" id="bankroll" value="<?php echo esc_attr($bankroll); ?>" />
                        </div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <div class="form-field">
                          <label for="kellystake">Stake sizing (Kelly criterion):</label>
                          <div class="percent-icon">
                            <input type="number" step="0.001" min="0" max="1" class="percent-icon" name="kellystake" id="kellystake" value="<?php echo esc_attr($kellystake); ?>" />
                          </div>
                        </div>
                      </div>
                      <!-- <div class="col-md-6 mb-3">
                        <div class="form-field">
                          <label for="maxstake">Max Stake:</label>
                          <div class="percent-icon">
                            <input type="number" step="0.01" min="0" name="maxstake" id="maxstake" value="<?php echo esc_attr($maxstake); ?>" />
                          </div>
                        </div>
                      </div> -->
                    </div>

                    <input type="submit" value="Save" />
                    <?php wp_nonce_field('user-settings', 'user-settings-nonce'); ?>
                  </form>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>