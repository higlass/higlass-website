export default function getQueryParams(queryString) {
  const _queryString = queryString.split('+').join(' ');

  const params = {};
  let tokens;
  const re = /[?&]?([^=]+)=([^&]*)/g;

  tokens = re.exec(_queryString);
  while (tokens) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    tokens = re.exec(_queryString);
  }

  return params;
}
