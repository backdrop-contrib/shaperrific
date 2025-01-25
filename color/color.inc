<?php
/**
 * @file
 * Color module support.
 */

/**
 * Color schemes information.
 */
$info = array(
  'fields' => array(
    'base' => t('Main background'),
    'text' => t('Text color'),
    'links' => t('Link color'),
    'shape' => t('Shape color'),
    'highlight' => t('Highlighted background'),
    'secondary' => t('Secondary background'),
    'border' => t('Border Color'),
  ),
  'schemes' => array(
    'default' => array(
      'title' => t('Default'),
      'colors' => array(
        'base' => '#fafafa',
        'text' => '#444444',
        'links' => '#327995',
        'shape' => '#e6e1cd',
        'highlight' => '#ffffff',
        'secondary' => '#e8f1f7',
        'border' => '#bbbbbb',
      ),
    ),
    'dark' => array(
      'title' => t('Dark'),
      'colors' => array(
        'base' => '#444444',
        'text' => '#fafafa',
        'links' => '#89c4e6',
        'shape' => '#52585b',
        'highlight' => '#3c3c3c',
        'secondary' => '#2b2b2b',
        'border' => '#5e5e5e',
      ),
    ),
    'blue' => array(
      'title' => t('Blue inverted'),
      'colors' => array(
        'base' => '#ebf4fa',
        'text' => '#4a4a4a',
        'links' => '#20678e',
        'shape' => '#fafafa',
        'highlight' => '#ffffff',
        'secondary' => '#dce9f2',
        'border' => '#aaaaaa',
      ),
    ),
  ),
  'blend_target' => '#ffffff',
  'css' => array('css/colors.css'),
);
