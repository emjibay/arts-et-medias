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
    if (user) {
      return isUserInGroup(user, 'admin');
    }
    return false;
  }

  function isUserCollaborator(user) {
    if (user) {
      return isUserInGroup(user, 'collaborator');
    }
    return false;
  }

  function isUserGuest(user) {
    if (user) {
      return isUserInGroup(user, 'guest');
    }
    return false;
  }

  function isUserInGroup(user, groupTitle) {
    let isInGroup = false;

    user._groups.forEach(group => {
      if (group.title === groupTitle) {
        isInGroup = true;
      }
    });

    return isInGroup;
  }
}
