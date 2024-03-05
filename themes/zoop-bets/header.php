<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title('|', true, 'right');
            bloginfo('name'); ?></title>
    <?php wp_head(); ?>
    <link rel="icon" href="<?php echo bloginfo('template_url') ?>/assets/images/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

</head>

<body <?php body_class(); ?>>

    <!-- <div class="header-menu w-100">
        <div class="row">
            <div class="col-12">
                <h1 class="mb-0"> <?php echo the_title(); ?> </h1>
            </div>
        </div>
    </div> -->

    <div class="main-menu">
        <div class="container">
            <div class="header-nav">
                <div class="logo-header">
                    <?php
                    $logo = get_field('logo', 'options');
                    if ($logo) : ?>
                        <a href="<?php echo bloginfo('url'); ?>">
                            <!-- <img class="site-logo" src="<?php echo esc_url($logo['url']); ?>" alt="<?php echo esc_attr($logo['alt']); ?>" />  -->
                            <span>Zoop</span> <span>Bets</span> </a>
                    <?php endif; ?>
                </div>
                <div class="menu-header align-self-center">
                    <?php
                    // Display the navigation menu
                    wp_nav_menu(array(
                        'theme_location' => 'primary-menu',
                        'menu_class'     => 'primary-menu',
                    ));
                    ?>
                </div>
            </div>
        </div>
    </div>