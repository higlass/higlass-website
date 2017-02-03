import { json } from 'd3';  // eslint-disable-line

const url = 'https://gist.githubusercontent.com/pkerpedjiev/104f6c37fbfd0d7d41c73a06010a3b7e/raw/higlass-examples.json';

function render(examples) {
  let html = '';

  examples.forEach((example) => {
    html += `
<li class="${example.columns === 2 ? 'two-columns' : ''}">
  <a href="${example.url ? example.url : ''}">
    <figure
      class="examples-figure"
      style="background-image: url(${example.image ? example.image : ''})">
    </figure>
  </a>
  ${example.title ? `<a href="${example.url ? example.url : ''}">${example.title}</a>` : ''}
  ${example.description ? `<p class="smaller">${example.description}</p>` : ''}
  ${example.location ? `<div class="smaller one-line location"><input onClick="this.select();" value="${example.location}" /></div>` : ''}
</li>`;
  });

  document.querySelector('#example-list').innerHTML = html;
}

json(url, (err, examples) => {
  if (err) throw err;

  render(examples);
});
