const path = require('path');

module.exports = {
  // If a template is not found somewhere else, serve it from the top-level
  // `views/` folder of the project
  viewsFolderFallback: path.resolve(__dirname, '..', '..', '..', 'views')
};
