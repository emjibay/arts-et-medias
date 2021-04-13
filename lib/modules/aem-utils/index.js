require('dotenv').config();


const fs = require('fs');
const moment = require('moment');

const config = require('../../../package.json');

const getWorkflowMode = require('../../utils/get-workflow-mode');
const isProd = require('../../utils/is-prod');
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
    getHeroImageUrlFromMetadata,
    getImageBasicData,
    getLatestUpdate,
    getMinified,
    getVersion,
    getWorkflowMode,
    includeAnalytics,
    isDraftMode,
    isLiveMode,
    isLocal,
    isPreviewMode,
    isProd,
    showTwitterTimeline,
  });

  function getMinified(options) {
    const files = fs.readdirSync('./public/apos-minified/');

    let response = null;

    files.forEach(filename => {
      if (filename.includes(options.when) && filename.includes(options.type)) {
        response = filename;
      }
    });

    return response;
  }


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
    if (isProd() && data.when === 'anon') {
      return true;
    }
    return false;
  }

  // env vars methods
  function showTwitterTimeline() {
    const showTwitterStr = process.env.SHOW_TWITTER;

    if (showTwitterStr) {
      return showTwitterStr.toLowerCase() === 'true';
    }

    return false;
  }

  // image methods
  function getHeroImageUrlFromMetadata(options) {
    const defaultResponse = '/img/opengraph.jpg';

    if (options.heroImage) {
      const aposImageData = apos.images.first(options.heroImage);
      if (aposImageData) {
        const imageData = getImageBasicData(aposImageData);
        if (imageData.url) {
          return imageData.url;
        } else {
          return defaultResponse;
        }
      } else {
        return defaultResponse;
      }
    } else {
      return defaultResponse;
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

  // workflow methods
  function isLiveMode(data) {
    return getWorkflowMode(data) === 'live';
  }

  function isPreviewMode(data) {
    return getWorkflowMode(data) === 'preview';
  }

  function isDraftMode(data) {
    return getWorkflowMode(data) === 'draft';
  }
}
