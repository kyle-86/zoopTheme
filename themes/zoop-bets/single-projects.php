<?php
// Header
get_header();

// Get the ID of the current page
$page_id = get_the_ID();
$featured_image_url = get_the_post_thumbnail_url($page_id);
?>

<section class="projects-banner">
  <?php
  ?>
  <div class="page-image" style="background-image:url(<?php echo esc_url($featured_image_url); ?>)">
    <div class="page-title">
      <div class="container">
        <?php if ($title = get_the_title()) : ?>
          <h1 class="text-center p-t-200 p-b-200 mb-0"> <?php echo esc_html($title); ?> </h1>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>

<div class="projects-page">
  <div class="container">
    <div class="row justify-content-between">
      <div class="col-lg-8">
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
            $template_path = get_template_directory() . "/inc/project-blocks/{$cleaned_layout_name}/{$cleaned_layout_name}.php";

            // Check if the template file exists
            if (file_exists($template_path)) {
              // Include the template file
              include($template_path);
            }
          }
        }
        ?>
      </div>
      <div class="col-lg-3">
        <div class="project-sidebar">
          <div class="sidebar-category m-b-24">
            <div class="cat-title m-b-10">Client:</div>
            <?php if ($client = get_field('client')) : ?>
              <span class="h6"><?php echo esc_html($client); ?></span>
            <?php endif; ?>
          </div>
          <div class="sidebar-category m-b-24">
            <div class="cat-title m-b-10">Notable Skills:</div>
            <?php
            // Get and display taxonomy terms (assuming "skill" is the taxonomy name)
            $skills = get_the_terms(get_the_ID(), 'skill');
            if ($skills && !is_wp_error($skills)) :
              foreach ($skills as $skill) :
            ?>
                <span class="each-skill h6 mb-0">
                  <?php echo esc_html($skill->name); ?>
                </span>
            <?php
              endforeach;
            endif;
            ?>
          </div>

          <?php if (have_rows('stats')) : ?>
            <?php while (have_rows('stats')) :
              the_row(); ?>

              <div class="sidebar-category m-b-24">
                <div class="cat-title m-b-10">
                  <?php if ($category = get_sub_field('category')) : ?>
                    <?php echo esc_html($category); ?>
                  <?php endif; ?></div>
                <span class="h6">
                  <?php if ($category_description = get_sub_field('category_description')) : ?>
                    <?php echo $category_description; ?>
                  <?php endif; ?>
                </span>
              </div>

            <?php endwhile; ?>
          <?php endif; ?>

        </div>
      </div>
    </div>
  </div>
</div>
<?php
// Footer
get_footer();
