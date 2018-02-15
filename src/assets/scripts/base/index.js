import $ from 'domtastic';
import MenuToggler from './menu-toggler';

export function lightsOff() {
  window.localStorage.setItem('hgw.darkTheme', 1);
  $(document.body).addClass('dark-theme');
}

export function lightsOn() {
  window.localStorage.removeItem('hgw.darkTheme');
  $(document.body).removeClass('dark-theme');
}

/* eslint-disable no-unused-vars */
const toggler = new MenuToggler(document.querySelector('#topbar .menu-toggler'));

export default {
  lightsOff,
  lightsOn
};
