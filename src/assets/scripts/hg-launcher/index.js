import * as hglib from 'hglib';  // eslint-disable-line

import getQueryParams from '../utils/get-query-params';
import dropJson from '../utils/drop-json';
// import { requestNextAnimationFrame } from '../utils/request-animation-frame';

const query = getQueryParams(document.location.search);

const launchHg = config => hglib.createHgComponent(
  document.querySelector('#higlass'),
  config,
  { bounded: true },
  (api) => {
    window.higlassApi = api;
  }
);

dropJson(document.body, (event) => {
  const file = event.dataTransfer.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', (fileEvent) => {
    let newConfig;

    try {
      newConfig = JSON.parse(fileEvent.target.result);
    } catch (e) {
      console.error('Only drop valid JSON', e);  // eslint-disable-line
    }

    if (newConfig) {
      launchHg(newConfig);
    }
  });

  reader.readAsText(file);
});


if (query.config) {
  launchHg(`/api/v1/viewconfs/?d=${query.config}`);
} else {
  launchHg(hglib.defaultViewConfig);
}
