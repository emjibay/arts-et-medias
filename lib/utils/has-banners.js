require('dotenv').config();


module.exports = hasBanners;


function hasBanners() {
  if (process.env.HAS_BANNERS === undefined) {
    return false;
  }

  return process.env.HAS_BANNERS;
}
