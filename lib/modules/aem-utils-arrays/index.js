const _ = require('lodash');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemArrays',
  label: 'AEM Arrays Utils',
  construct: construct,
};

function construct(self, options) {
  self.addHelpers({
    merge,
    splice,
    truncate,
  });

  function merge(array1, array2) {
    // none is array
    if (!Array.isArray(array1) && !Array.isArray(array2)) {
      console.warn('⚠️ Both parameters are expected to be arrays, which is not the case.');
      return [];
    }

    // #1 only is array
    if (Array.isArray(array1) && !Array.isArray(array2)) {
      return array1;
    }

    // #2 only is array
    if (!Array.isArray(array1) && Array.isArray(array2)) {
      return array2;
    }

    // both are arrays
    return [...array1, ...array2];
  }

  function splice(array, index) {
    if (index < 0) {
      return array;
    }

    let clone = array.slice();
    clone.splice(index, 1);

    return clone;
  }

  function truncate(array, length) {
    if (array.length > length) {
      let clone = array.slice();
      clone.length = length;
      return clone;

    } else {
      return array;
    }
  }
}
