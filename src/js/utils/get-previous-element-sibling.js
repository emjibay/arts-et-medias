module.exports = getPreviousElementSibling;


function getPreviousElementSibling(element, attempt) {
  if (!element) {
    return null;
  }

  var maxAttempts = 10; // safely stop recursivity
  var currentAttempt = attempt | 0;

  if (currentAttempt >= maxAttempts) {
    return null;
  }

  var sibling = element.previousSibling;
  currentAttempt++;

  if (!sibling || sibling.nodeType !== 1) {
    return getPreviousElementSibling(sibling, currentAttempt);
  }

  return sibling;
}
