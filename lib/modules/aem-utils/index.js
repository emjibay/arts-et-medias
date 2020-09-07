const config = require('../../../package.json');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemUtils',
  label: 'AEM Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    getVersion,
  });

  function getVersion() {
    return `v${config.version}`;
  }
}
