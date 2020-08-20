let currentLocale;

// dom elements
let forms;
let selects;


// public api
export function init() {
  getDOMElements();
  getCurrentLocale();
  updateSelect();
  addEventListeners();
}


// methods
function addEventListeners() {
  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        const { langSwitch } = form;
        currentLocale = langSwitch.value.toLowerCase();
        window.location = `/${ currentLocale }/`;
      }
    );
  }
}

function getCurrentLocale() {
  currentLocale = document.body.dataset.locale.replace('-draft', '');
}

function getDOMElements() {
  forms = document.getElementsByClassName('lang-switch-form');
  selects = document.getElementsByClassName('lang-switch-select');
}

function updateSelect() {
  // create callback
  const isCurrentLocale = (option) => option.value.toUpperCase() === currentLocale.toUpperCase();

  // loop through all selects on page
  for (let i = 0; i < selects.length; i++) {
    const select = selects[i];

    // find index in HTMLOptionsCollection
    let index = -1;
    for (let i = 0; i < select.options.length; i++) {
      const option = select.options[i];
      if (isCurrentLocale(option)) {
        index = i;
      }
    }

    // update <select>
    select.selectedIndex = index;
  }
}
