require('dotenv').config();


module.exports = isProd;


function isProd() {
  return process.env.APOS_ENV === 'production';
}
