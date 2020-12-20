// dom elements
let button;
let main;

export function init() {
  // get dom elements
  button = document.getElementById('skipToMainBtn');
  main = document.getElementById('main');

  // event handlers
  button.addEventListener(
    'click',
    (event) => {
      main.focus();
    }
  );
}
