const isUserInGroup = require('../../utils/is-user-in-group');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemUsers',
  label: 'AEM Users Utils',
  construct: construct,
};


function construct(self, options) {
  self.addHelpers({
    isUserAdmin,
    isUserCollaborator,
    isUserGuest,
    isUserInGroup,
  });

  function isUserAdmin(user) {
    return isUserInGroup(user, 'admin');
  }

  function isUserCollaborator(user) {
    return isUserInGroup(user, 'collaborator');
  }

  function isUserGuest(user) {
    return isUserInGroup(user, 'guest');
  }
}
