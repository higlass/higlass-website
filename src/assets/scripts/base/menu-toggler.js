import $ from 'domtastic';

import getParent from './get-parent';

export default class MenuToggler {
  constructor(el) {
    this.toggler = $(el);
    this.menu = $(getParent(el, 'is-toggable'));

    this.toggler.on('click', () => this.toggle());
  }

  close() {
    if (this.menu.hasClass('is-active')) {
      this.menu.removeClass('is-active');
      this.toggler.removeClass('is-active');
    }
  }

  open() {
    if (!this.menu.hasClass('is-active')) {
      this.menu.addClass('is-active');
      this.toggler.addClass('is-active');
    }
  }

  toggle() {
    this.menu.toggleClass('is-active');
    this.toggler.toggleClass('is-active');
  }
}
