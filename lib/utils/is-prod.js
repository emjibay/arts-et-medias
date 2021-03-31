require('dotenv').config();


module.exports = isProd;


function isProd() {
  return process.env.APOS_NODE_ENV === 'production';
}
