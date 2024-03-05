<section class="<?php echo $cleaned_layout_name; ?>__block">
  <div class="content_area">
    <div class="row">
      <div class="col-lg-12">
        <?php if ($content = get_sub_field('content')) : ?>
          <div class="page_content mt-40 mb-40 p-40">
            <?php echo $content; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>