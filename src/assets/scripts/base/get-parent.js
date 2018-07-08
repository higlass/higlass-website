export default function (el, className) {
  let parent = el.parentNode;

  while (
    parent
    && parent.tagName !== 'BODY'
    && parent.className.indexOf(className) < 0
  ) {
    parent = parent.parentNode;
  }

  return parent;
}
