const modulesList = [
  // models
  'models/breakpoints-model',
  // components
  'components/lang-switch',
  'components/mega-menu',
  'components/mobile-menu',
  'components/skip-to-main-button',
];


// methods definitions
function initAll() {
  // import all *.js files and `init()` them
  modulesList.forEach((m) => {
    // require module
    const loadedModule = require(`./${ m }`);

    // init() if method exists
    if ((typeof loadedModule.init) === 'function') {
      loadedModule.init();
    }
  });
}

// init all on page load
$(initAll);
