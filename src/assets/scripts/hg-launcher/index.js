import * as hglib from 'hglib';  // eslint-disable-line

import getQueryParams from '../utils/get-query-params';
import dropJson from '../utils/drop-json';
// import { requestNextAnimationFrame } from '../utils/request-animation-frame';

const query = getQueryParams(document.location.search);

const launchHg = (divId, config, bounded) => hglib.createHgComponent(
  document.querySelector(divId),
  config,
  { bounded },
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

const viewconfId = query.config ? query.config : 'default';

launchHg('#higlass', `/api/v1/viewconfs/?d=${viewconfId}`, true); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass2', 'http://higlass.io/api/v1/viewconfs/?d=J4gJBkKrS6qm3ZCrVMoayA', true); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass3', 'http://higlass.io/api/v1/viewconfs/?d=ZigL43TcToGVUdlHegVHoQ', false); // TODO: Graceful fallback if no viewconf with this ID?
