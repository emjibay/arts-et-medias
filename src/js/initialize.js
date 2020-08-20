const modulesList = [
  // models
  'models/breakpoints-model',
  // components
  'components/lang-switch',
  'components/mega-menu',
  'components/mobile-menu',
];


// methods definitions
function initAll() {
  // import all *.js files and `init()` them
  modulesList.forEach(function (m) {
    // require module
    let loadedModule = require(`./${ m }`);

    // init() if method exists
    if ((typeof loadedModule.init) === 'function') {
      loadedModule.init();
    }
  });
}

// init all on page load
$(initAll);
