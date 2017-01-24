import $ from 'domtastic';

import hasParent from './has-parent';

export default function dropJson(el, dropCallback) {
  const $el = $(el);

  document.addEventListener('dragenter', (event) => {
    if (hasParent(event.target, el)) {
      $el.addClass('is-dragging-over');
    }
  });

  document.addEventListener('dragover', (event) => {
    event.preventDefault();
  });


  document.addEventListener('dragleave', () => {
    $el.removeClass('is-dragging-over');
  });

  document.addEventListener('drop', (event) => {
    event.preventDefault();

    if (hasParent(event.target, el)) {
      dropCallback(event);
    }

    $el.removeClass('is-dragging-over');
  }, false);
}
