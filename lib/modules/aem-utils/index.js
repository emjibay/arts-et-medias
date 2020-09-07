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
    getImageBasicData,
    getLatestUpdate,
    getVersion,
  });

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
}
