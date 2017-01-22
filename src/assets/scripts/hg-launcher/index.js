import * as hglib from 'hglib';  // eslint-disable-line

import getQueryParams from '../utils/get-query-params';

const query = getQueryParams(document.location.search);

const config = query.config ?
  query.config : 'G8DKPkbdT8i57a3t9TObPA';

hglib.HgComponent(
  document.querySelector('#higlass'),
  `http://52.45.229.11/viewconfs/?d=${config}`
);
