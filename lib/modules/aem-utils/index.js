const fs = require('fs');
const moment = require('moment');

const config = require('../../../package.json');

const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemUtils',
  label: 'AEM Utils',
  construct,
};


function construct(self, options) {
  const { apos } = self;

  self.addHelpers({
    ensureHTTPS,
    getImageBasicData,
    getLatestUpdate,
    getVersion,
    includeAnalytics,
    isLocal,
    isProduction,
  });

  function ensureHTTPS(url) {
    // error checks
    if (!url) {
      throw new Error(
        'ensureHTTPS() expected a `url` string as parameter.'
      );
    }

    // do nothing in local dev mode
    if (url.toLowerCase().indexOf('localhost') > -1) {
      return url;
    }

    const http = /^((http):\/\/)/;
    if (http.test(url)) {
      return url.replace(http, 'https://');
    } else {
      return url;
    }
  }

  function getImageBasicData(imageData) {
    let response = undefined;

    if (imageData) {
      response = {
        url: apos.attachments.url(imageData),
        caption: imageData._title,
        credit: imageData._credit,
      };
      if (imageData._description) {
        response.alt = imageData._description;
      } else if (imageData._title) {
        response.alt = imageData._title;
      }

    } else {
      response = {
        url: '/img/missing-image.png',
        alt: '',
      };
    }

    if (!response.url) {
      response.url = '/img/missing-image.png';
    }

    if (!response.alt) {
      response.alt = '';
    }

    return response;
  }

  function getLatestUpdate() {
    try {
      const pathToPackage = './package.json';
      const stats = fs.statSync(pathToPackage);
      return moment(stats.mtime).format('YYYY-MM-DD');

    } catch (error) {
      log.critical(error);
      return null;
    }
  }

  function getVersion() {
    return `v${config.version}`;
  }

  function isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  function isLocal(data) {
    const { baseUrl } = data;

    if (baseUrl && (baseUrl.indexOf('localhost') !== -1)) {
      return true;
    }

    return false;
  }

  function includeAnalytics(data) {
    if (isLocal(data)) {
      return false;
    }
    if (isProduction() && data.when === 'anon') {
      return true;
    }
    return false;
  }
}
