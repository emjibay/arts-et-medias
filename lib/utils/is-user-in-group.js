const log = require('./log');


module.exports = isUserInGroup;


function isUserInGroup(user, groupTitle) {
  if (!user) {
    // no user, most likely not logged in
    return false;
  }


  const warningPrefix = 'Error at isUserInGroup():';

  if (!groupTitle || typeof groupTitle !== 'string') {
    throw new Error(
      warningPrefix
      + ' Expected `groupTitle`, the second parameter, to be a string.'
    );
  }

  if (!user._groups) {
    log.warning(
      warningPrefix
      + '`user` does not have a `_group` property.'
    );
    return false;
  }

  let isInGroup = false;
  user._groups.forEach(group => {
    if (group.title === groupTitle) {
      isInGroup = true;
    }
  });

  return isInGroup;
}
