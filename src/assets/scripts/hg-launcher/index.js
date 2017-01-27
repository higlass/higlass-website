import * as hglib from 'hglib';  // eslint-disable-line

import getQueryParams from '../utils/get-query-params';
import dropJson from '../utils/drop-json';
import { requestNextAnimationFrame } from '../utils/request-animation-frame';

const query = getQueryParams(document.location.search);

const baseConfigId = query.config ?
  query.config : 'B80L-PFiTLihXPGLcYvXbg';

const launchHg = config => hglib.HgComponent(
  document.querySelector('#higlass'),
  config,
  { bounded: true }
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

requestNextAnimationFrame(() => {
  launchHg(`http://higlass.site/api/v1/viewconfs/?d=${baseConfigId}`);
});
