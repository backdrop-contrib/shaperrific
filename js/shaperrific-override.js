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
    let currentVal = $('#edit-shape').val();
    let iframeBody = $("#preview").contents().find('body')[0];
    for (let i = iframeBody.classList.length - 1; i >= 0; i--) {
      const className = iframeBody.classList[i];
      if (className.startsWith('shape-')) {
         iframeBody.classList.remove(className);
      }
    }
    iframeBody.classList.add(currentVal);
  },
  /**
   * Sets the current form values and refreshes the preview.
   */
  updatePreview: function () {
    // Save the form values.
    let values = {
      scheme: $('#edit-scheme').val(),
      palette: {}
    };
    values.scheme = $('#edit-scheme').val();
    $('input[data-color-name]').each(function () {
      values.palette[this.dataset.colorName] = this.value;
    });

    // This replaces the ajax post from color.js.
    let $head = $("#preview").contents().find("head");
    let template = $('#css-template').text();
    for (const item in values.palette) {
      template = template.replace('%' + item + '%', values.palette[item]);
    }
    let css = '<style type="text/css">' + template + '</style>';
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
    const widget = this;
    // @todo clean up this mess...
    let settings = document.getElementById('edit-scheme').dataset;
    let schemes = JSON.parse(settings.colorSchemes);
    // This behavior attaches by ID, so is only valid once on a page.
    let form = $('#system-theme-settings .color-form', context).once('color');
    if (form.length === 0) {
      return;
    }

    // Setup custom preview.
    let previewMarkup = '<div class="color-preview"><iframe id="preview" src="' + Backdrop.settings.shaperrific.previewUrl + '"></iframe></div>';
    $('#system-theme-settings').addClass('has-preview').after(previewMarkup);

    // Set up colorScheme selector.
    $('#edit-scheme', form).on('change', function () {
      let schemeName = this.value;
      if (schemeName !== '' && schemes[schemeName]) {
        // Get colors of active scheme.
        var colors = schemes[schemeName];
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
      let schemeName =  document.getElementById('edit-scheme').value;
      let key = this.dataset.colorName;
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