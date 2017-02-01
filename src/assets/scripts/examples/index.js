import { json } from 'd3';  // eslint-disable-line

const url = 'https://rawgit.com/pkerpedjiev/104f6c37fbfd0d7d41c73a06010a3b7e/raw/03c288aacd4672aa3ef3eee9b97709a42471e76e/higlass-examples.json';

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
    ${example.title ? `<p>${example.title}</p>` : ''}
  </a>
  ${example.description ? `<p class="smaller">${example.description}</p>` : ''}
  ${example.location ? `<input class="one-line" onClick="this.select();" value="${example.location}" />` : ''}
</li>`;
  });

  document.querySelector('#example-list').innerHTML = html;
}

json(url, (err, examples) => {
  if (err) throw err;

  render(examples);
});
