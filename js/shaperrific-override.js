/**
 * @file
 * Override Backdrop.behaviors.color to get shape selection preview working.
 */
(function ($) {
"use strict";

Backdrop.behaviors.color = {
  /**
   * Change iframe content body class according to selected shape.
   */
  updateShape: function () {
    const currentVal = $('#edit-shape').val();
    const iframeBody = $("#preview").contents().find('body')[0];
    for (let i = iframeBody.classList.length - 1; i >= 0; i--) {
      const className = iframeBody.classList[i];
      if (className.startsWith('shape-')) {
         iframeBody.classList.remove(className);
      }
    }
    iframeBody.classList.add(currentVal);
  },
  /**
   * Set the current form values and refresh the preview.
   */
  updatePreview: function () {
    // Set the form values.
    const values = {
      scheme: $('#edit-scheme').val(),
      palette: {}
    };
    values.scheme = $('#edit-scheme').val();
    $('input[data-color-name]').each(function () {
      values.palette[this.dataset.colorName] = this.value;
    });

    // This replaces the ajax post from color.js.
    const $head = $("#preview").contents().find("head");
    let template = $('#css-template').text();
    for (const item in values.palette) {
      template = template.replace('%' + item + '%', values.palette[item]);
    }
    const css = '<style type="text/css">' + template + '</style>';
    $head.append(css);
  },
  /**
   * Resets the color scheme selector.
   */
  resetScheme: function () {
    $('#edit-scheme').each(function () {
      this.selectedIndex = this.options.length - 1;
    });
  },
  /**
   * Attach overridden behavior.
   */
  attach: function (context) {
    // If the color module's off, we don't need to do anything, as then we only
    // have the shape select list in the form and no preview.
    const schemeSelect = document.getElementById('edit-scheme');
    if (!schemeSelect) {
      return;
    }
    const widget = this;
    const settings = schemeSelect.dataset;
    const schemes = JSON.parse(settings.colorSchemes);
    const form = $('#system-theme-settings .color-form', context);
    if (!schemes || !form) {
      return;
    }

    // Setup custom preview.
    const previewMarkup = '<div class="color-preview"><iframe id="preview" src="' + Backdrop.settings.shaperrific.previewUrl + '"></iframe></div>';
    $('#system-theme-settings').addClass('has-preview').after(previewMarkup);

    // Set up colorScheme selector.
    $('#edit-scheme', form).on('change', function () {
      const schemeName = this.value;
      if (schemeName !== '' && schemes[schemeName]) {
        // Get colors of active scheme.
        const colors = schemes[schemeName];
        for (const fieldName in colors) {
          if (colors.hasOwnProperty(fieldName)) {
            let input = $("input[data-color-name='" + fieldName + "']");
            if (input.val() && input.val() !== colors[fieldName]) {
              input.val(colors[fieldName]);
            }
          }
        }
        widget.updatePreview();
      }
    });

    $('input[data-color-name]').on('change', function () {
      const schemeName =  schemeSelect.value;
      const key = this.dataset.colorName;
      if (schemeName !== '' && this.value !== schemes[schemeName][key]) {
        widget.resetScheme();
      }
      widget.updatePreview();
    });

    $('#edit-shape').on('change', function () {
      widget.updateShape();
    });

    // Wait for the iframe content to be loaded.
    document.getElementById('preview').contentWindow.addEventListener('load', function (event) {
      widget.updateShape();
      widget.updatePreview();
      // Block all links inside iframe, allow scrolling, but no navigation
      // through the site.
      const links = event.target.documentElement.querySelectorAll('a');
      for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      }
    });
  }
};
})(jQuery);