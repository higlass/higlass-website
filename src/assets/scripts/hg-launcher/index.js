import * as hglib from 'hglib';  // eslint-disable-line

import getQueryParams from '../utils/get-query-params';
import dropJson from '../utils/drop-json';

const query = getQueryParams(document.location.search);

const baseConfigId = query.config ?
  query.config : 'G8DKPkbdT8i57a3t9TObPA';

const launchHg = config => hglib.HgComponent(
  document.querySelector('#higlass'),
  config
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

launchHg(`http://52.45.229.11/viewconfs/?d=${baseConfigId}`);
