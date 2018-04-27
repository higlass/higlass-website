import $ from 'domtastic';
import MenuToggler from './menu-toggler';

export function lightsOff(totalDarkness) {
  window.localStorage.setItem('hgw.darkTheme', 1 + (1 * !!totalDarkness));
  $(document.body).addClass('dark-theme');
  if (totalDarkness) {
    $(document.body).addClass('darker-theme');
  } else {
    $(document.body).removeClass('darker-theme');
  }
}

export function lightsOn() {
  window.localStorage.removeItem('hgw.darkTheme');
  $(document.body).removeClass('darker-theme');
  $(document.body).removeClass('dark-theme');
}

/* eslint-disable no-unused-vars */
const toggler = new MenuToggler(document.querySelector('#topbar .menu-toggler'));

const swag = [
  [66, 82, 73, 71, 72],
  [68, 65, 82, 75],
  [68, 65, 82, 75, 69, 82]
];
const swagInterval = 500;

let swagI = [];
let swagJ = 0;
let swagTime = performance.now();

document.addEventListener('keyup', ({ keyCode }) => {
  const now = performance.now();

  if (now - swagTime > swagInterval) {
    swagI = [];
    swagJ = 0;
  }

  swagTime = now;

  if (swagJ === 0) {
    swag.forEach((codeWurst, index) => {
      if (keyCode === codeWurst[0]) {
        swagI.push(index);
        swagJ = 1;
      }
    });
  } else {
    let ohYes = false;
    for (let i = swagI.length; i--;) {
      if (swagJ < swag[swagI[i]].length && keyCode === swag[swagI[i]][swagJ]) {
        ohYes = true;
      } else {
        swagI.splice(i, 1);
      }
    }
    if (ohYes) swagJ += 1;
  }

  swagI.forEach((i) => {
    if (swagJ === swag[i].length) {
      switch (i) {
        case 0:
          lightsOn();
          break;
        case 1:
          lightsOff();
          break;
        case 2:
          lightsOff(true);
          break;
        default:
          // Nothing
      }
    }
  });
});

export default {
  lightsOff,
  lightsOn
};
