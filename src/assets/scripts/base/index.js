import $ from 'domtastic';
import MenuToggler from './menu-toggler';

export function disableDarkTheme() {
  if (window.localStorage.getItem('higlass.disableDarkTheme')) {
    window.localStorage.removeItem('higlass.disableDarkTheme');
    $(document.body).addClass('dark-theme');
    $(document.body).removeClass('dark-theme-disabled');
  } else {
    window.localStorage.setItem('higlass.disableDarkTheme', 1);
    $(document.body).removeClass('dark-theme');
    $(document.body).addClass('dark-theme-disabled');
  }
}

/* eslint-disable no-unused-vars */
const toggler = new MenuToggler(document.querySelector('#topbar .menu-toggler'));

export default {
  disableDarkTheme
};
