<?php
/**
 *
 */

/**
 * Implements hook_preprocess_HOOK().
 */
function shaperrific_preprocess_page(&$variables) {
  backdrop_add_library('system', 'opensans');

  $variables['classes'][] = 'has-shape';
  $variables['classes'][] = theme_get_setting('shape');
}

/**
 * Implements hook_tinymce_options_alter().
 */
function shaperrific_tinymce_options_alter(array &$options, $format) {
  // Squeeze in the color scheme, if possible (only runs if this is the active
  // theme.)
  $color_paths = theme_get_setting('color.stylesheets', 'shaperrific');
  if (!empty($color_paths) && $url = file_create_url($color_paths[0])) {
    $options['tiny_options']['content_css'][] = $url;
  }
}
