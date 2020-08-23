module.exports = isDraftMode;


function isDraftMode() {
  let response = false;

  const { classList, } = document.body;

  if (!classList) {
    return response;
  }

  for (let i = 0; i < classList.length; i++) {
    const className = classList[i];
    if (className.indexOf('draft') > -1) {
      response = true;
    }
  }

  return response;
}
