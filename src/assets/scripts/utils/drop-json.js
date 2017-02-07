import $ from 'domtastic';

import hasParent from './has-parent';

export default function dropJson(el, dropCallback) {
  const $el = $(el);

  document.addEventListener('dragenter', (event) => {
    $el.addClass('is-dragging-over');

    event.stopPropagation();
    event.preventDefault();
    return false;
  });

  document.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  });


  el.addEventListener('dragleave', (event) => {
    if (event.target.id === 'drop-layer') {
      $el.removeClass('is-dragging-over');
    }

    event.stopPropagation();
    event.preventDefault();
    return false;
  });

  document.addEventListener('drop', (event) => {
    event.preventDefault();

    if (hasParent(event.target, el)) {
      dropCallback(event);
    }

    $el.removeClass('is-dragging-over');
  }, false);
}
