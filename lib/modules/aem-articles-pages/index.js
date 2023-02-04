const isUserInGroup = require('../../utils/is-user-in-group');
const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-pieces-pages',
  label: 'Articles Page',

  construct: (self, options) => {
    self.on('apostrophe-pages:beforeSend', 'loadPersonPage', async function(req) {
      // handle piece set to private
      const { piece } = req.data;
      /* eslint-disable no-prototype-builtins */
      if (piece && piece.hasOwnProperty('isPrivate') && piece.isPrivate) {
        const isAdmin = isUserInGroup(req.data.user, 'admin');
        if (!isAdmin) {
          log.warning(`"${ piece.title }" is private, redirecting to 404.`);
          const { res } = req;
          res.redirect('/404');
        }
      }
      /* eslint-enable no-prototype-builtins */
    });
  },
};
