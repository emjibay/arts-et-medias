const isUserInGroup = require('./is-user-in-group');


module.exports = getSearchProps;


function getSearchProps(req, options) {
  // default response
  let response = {};

  // add props passed as parameters
  if (options && options.props) {
    response = { ...response, ...options.props };
  }

  // add private props if needed
  const isAdmin = isUserInGroup(req.data.user, 'admin');
  if (!isAdmin) {
    const isPrivate = { isPrivate: false || null || undefined };
    response = { ...response, ...isPrivate };
  }

  return response;
}
