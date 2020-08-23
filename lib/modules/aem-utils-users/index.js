module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemUsers',
  label: 'AEM Users Utils',
  construct: construct,
};


function construct(self, options) {
  self.addHelpers({
    isUserAdmin,
    isUserGuest,
    isUserInGroup,
  });

  function isUserAdmin(user) {
    let isAdmin = false;
    if (user) {
      isAdmin = isUserInGroup(user, 'admin');
    }
    return isAdmin;
  }

  function isUserGuest(user) {
    let isGuest = false;
    if (user) {
      isGuest = isUserInGroup(user, 'guest');
    }
    return isGuest;
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
