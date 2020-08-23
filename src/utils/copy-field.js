const _ = require('lodash');


module.exports = copyField;


function copyField(source, target) {
  const json = JSON.stringify(source);
  const copy = JSON.parse(json);
  return [_.merge(copy[0], target), ];
}
