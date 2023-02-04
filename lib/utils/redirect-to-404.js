const getSanitizedLocale = require('./get-sanitized-locale');


module.exports = redirectTo404;


function redirectTo404(req) {
  // error checks
  if (!req) {
    throw new Error('redirectTo404() expects `req` object.');
  }

  const { res, data } = req;

  const locale = getSanitizedLocale(data);
  res.redirect(`/${locale}/404`);
}
