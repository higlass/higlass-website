import { json } from 'd3-request';

const url = 'http://higlass.io/api/v1/tilesets/';

function render(dataSets) {
  let html = '';

  dataSets.filter(dataSet => !dataSet.private).forEach((dataSet) => {
    html += `
      <li class="flex-c">
        <!-- <figure class="datasets-figure"></figure> -->
        <div class="flex-i-g-1">
          <h3 class="smaller">${dataSet.name}</h3>
          ${dataSet.description ? `<p class="smaller">${dataSet.description}</p>` : ''}
          <h4>Properties</h4>
          <ul class="flex-c badges no-list-style properties">
            ${dataSet.filetype ? `<li class="smaller">File type: ${dataSet.filetype}</li>` : ''}
            ${dataSet.datatype ? `<li class="smaller">Data type: ${dataSet.datatype}</li>` : ''}
            ${dataSet.coordSystem ? `<li class="smaller">Coordinate system: ${dataSet.coordSystem}</li>` : ''}
          </ul>
        </div>
      </li>`;
  });

  document.querySelector('#data-set-list').innerHTML = html;
}

json(url, (err, dataSets) => {
  if (err) throw err;

  render(dataSets.results);
});
