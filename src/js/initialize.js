const modulesList = [
  // models
  'models/breakpoints-model',
  // components
  'components/mega-menu',
  'components/lang-switch',
  'components/mobile-menu',
  'components/skip-to-main-button',
  // pages
  'pages/analytics-downloads',
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
