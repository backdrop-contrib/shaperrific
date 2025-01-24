<?php
/**
 * @file
 * Theme settings form.
 */

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function shaperrific_form_system_theme_settings_alter(&$form, &$form_state) {
  $form['shape'] = array(
    '#type' => 'select',
    '#title' => t('Background shape'),
    '#options' => array(
      'shape-circle' => t('Circle'),
      'shape-polygon-1' => t('Polygon 1'),
      'shape-polygon-2' => t('Polygon 2'),
      'shape-polygon-3' => t('Polygon 3'),
      'shape-ellipse' => t('Ellipse'),
    ),
    '#default_value' => theme_get_setting('shape', 'shaperrific'),
    '#weight' => -1,
  );

  // Hidden template for JS substitutions.
  $template = '<pre id="css-template" style="display: none;">:root {
  --bedrock-text-color: %text%;
  --bedrock-link-color: %links%;
  --bedrock-bg-color: %base%;
  --bedrock-bg-color-highlight: %highlight%;
  --bedrock-bg-color-secondary: %secondary%;
  --bedrock-border-color: %border%;
  --shape-bg-color: %shape%;
}</pre>';
  $form['template'] = array(
    '#type' => 'markup',
    '#markup' => $template,
  );

  $theme_path = backdrop_get_path('theme', 'shaperrific');
  $form['#attached']['css'][] = $theme_path . '/css/color-admin.css';
  // Overrides parts of color.js for a different preview approach.
  $form['#attached']['js'][] = $theme_path . '/js/shaperrific-override.js';
  $settings['shaperrific'] = array(
    'previewUrl' => url('', array('query' => array('preview' => 'shaperrific'))),
  );
  $form['#attached']['js'][] = array(
    'type' => 'setting',
    'data' => $settings,
  );
}
