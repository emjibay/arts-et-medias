const _ = require('lodash');


module.exports = {
  pushUnique,
}


function pushUnique(array, value) {
  // error checks
  if (!Array.isArray(array)) {
    throw new Error(
      'pushUnique() expects an array as a first parameter'
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
