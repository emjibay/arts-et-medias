const _ = require('lodash');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemArrays',
  label: 'AEM Arrays Utils',
  construct: construct,
};

function construct(self, options) {
  self.addHelpers({
    flatten,
    intersect,
    merge,
    splice,
    truncate,
  });

  function flatten(array) {
    // none is array
    if (!Array.isArray(array)) {
      console.warn('⚠️ Expected an array to flatten, but was not provided one.');
      return [];
    }

    return _.flattenDeep(array);
  }

  function intersect(array1, array2) {
    if (!array1 || !array2) {
      return false;
    }

    return array1.filter(value => array2.includes(value)).length > 0;
  }

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
