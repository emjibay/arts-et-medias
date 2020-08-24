const _ = require('lodash');


module.exports = {
  intersect,
  pushUnique,
};

function intersect(array1, array2) {
  // error checks
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    throw new Error(
      'intersect() expected two arrays to compare.'
    );
  }

  const filtered = array1.filter(value => array2.includes(value));
  return (filtered && filtered.length > 0);
}

function pushUnique(array, value) {
  // error checks
  if (!Array.isArray(array)) {
    throw new Error(
      'pushUnique() expected an array as a first parameter'
    );
  }

  let isAlreadyAdded = false;
  array.forEach(element => {
    if (_.isEqual(element, value)) {
      isAlreadyAdded = true;
    }
  });
  if (!isAlreadyAdded) {
    array.push(value);
  }

  return array;
}
