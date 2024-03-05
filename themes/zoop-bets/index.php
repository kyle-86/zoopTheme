<?php
// Header
get_header(); ?>
<div class="container">
  <div class="site-body">

    <?php // Check if the flexible content field has rows
    if (have_rows('flexible_content')) {
      // Loop through the rows of the flexible content field
      while (have_rows('flexible_content')) {
        the_row();

        // Get the layout name
        $layout_name = get_row_layout();
        $cleaned_layout_name = str_replace('_', '-', $layout_name); // Replace spaces with hyphens
        $cleaned_layout_name = strtolower($cleaned_layout_name);

        // Define the path to the template file
        $template_path = get_template_directory() . "/inc/page-blocks/{$cleaned_layout_name}/{$cleaned_layout_name}.php";

        // Check if the template file exists
        if (file_exists($template_path)) {
          // Include the template file
          include($template_path);
        }

        // Enqueue corresponding JavaScript file dynamically
        $js_file_path = get_template_directory_uri() . "/inc/page-blocks/{$cleaned_layout_name}/{$cleaned_layout_name}.js";

        // Check if the script has already been enqueued
        if (!wp_script_is("{$cleaned_layout_name}-script", 'enqueued')) {
          wp_enqueue_script("{$cleaned_layout_name}-script", $js_file_path, array(), null, true);
        }
      }
    } ?>

  </div>
</div>

<?php // Footer
get_footer();
