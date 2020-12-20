let currentLocale;

// dom elements
let forms;


// public api
export function init() {
  getCurrentLocale();
  getDOMElements();
  addEventListeners();
}


// methods
function addEventListeners() {
  if (!forms || !forms.length) {
    console.warn('Unable to handle lang switch form submissions');
    return;
  }

  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { langRadio } = form;
        currentLocale = langRadio.value.toLowerCase();
        window.location = `/${ currentLocale }/`;
      }
    );
  }
}

function getCurrentLocale() {
  const { locale } = document.body.dataset;
  if (locale) {
    currentLocale = locale.substr(0, 2).toLowerCase();
  } else {
    currentLocale = 'en';
  }
}

function getDOMElements() {
  forms = document.getElementsByClassName('lang-switch-form');
}
