import * as hglib from 'hglib';  // eslint-disable-line

import getQueryParams from '../utils/get-query-params';
import dropJson from '../utils/drop-json';
// import { requestNextAnimationFrame } from '../utils/request-animation-frame';

const query = getQueryParams(document.location.search);

const launchHg = (divId, config, bounded) => {
  if (!document.querySelector(divId)) {
    return;
  }
  hglib.createHgComponent(
    document.querySelector(divId),
      config,
      { bounded },
      (api) => {
        window.higlassApi = api;
      }
    );
};

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
      launchHg('#higlass', newConfig, true);
    }
  });

  reader.readAsText(file);
});

const viewconfId = query.config ? query.config : 'default';

launchHg('#higlass', `/api/v1/viewconfs/?d=${viewconfId}`, true); // TODO: Graceful fallback if no viewconf with this ID?

launchHg('#higlass1', 'http://higlass.io/api/v1/viewconfs/?d=default', true); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass2', 'http://higlass.io/api/v1/viewconfs/?d=twoviews', true); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass3', 'http://higlass.io/api/v1/viewconfs/?d=browserlike', false); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass4', 'http://higlass.io/api/v1/viewconfs/?d=browserwithdetails', false); // TODO: Graceful fallback if no viewconf with this ID?


launchHg('#higlass_test1', 'http://test.higlass.io/api/v1/viewconfs/?d=test_default', true); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass_test2', 'http://test.higlass.io/api/v1/viewconfs/?d=test_twoviews', true); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass_test3', 'http://test.higlass.io/api/v1/viewconfs/?d=test_browserlike', false); // TODO: Graceful fallback if no viewconf with this ID?
launchHg('#higlass_test4', 'http://test.higlass.io/api/v1/viewconfs/?d=test_browserwithdetails', false); // TODO: Graceful fallback if no viewconf with this ID?
