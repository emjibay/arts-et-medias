require('dotenv').config();


module.exports = hasBanners;


function hasBanners() {
  if (process.env.HAS_BANNERS === undefined) {
    return false;
  }

  /* eslint-disable eqeqeq */
  const response = process.env.HAS_BANNERS == 'true';
  /* eslint-disable eqeqeq */


  return response;
}
