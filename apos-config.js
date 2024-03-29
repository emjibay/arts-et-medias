'use strict';


const path = require('path');
const fs = require('fs');

const aposSearchFilters = require('./lib/constants/apos-search-filters');
const isProd = require('./lib/utils/is-prod')();


const customModuleNames = fs
  .readdirSync(path.resolve(__dirname, 'lib', 'modules'))
  .filter(dp => /^aem-/.test(dp));

const customModules = customModuleNames.reduce(
  (acc, dp) => {
    acc[dp] = {};
    return acc;
  },
  {}
);

const aposOptions = {
  root: module,

  shortName: 'arts-et-medias',

  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {
    // Note: most configuration occurs in the respective
    // modules' directories. See lib/apostrophe-assets/index.js for an example.

    // However any modules that are not present by default in Apostrophe must at
    // least have a minimal configuration here: `moduleName: {}`

    'apostrophe-assets': {
      minify: isProd,
    },

    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },

    'apostrophe-docs': {
      // present clear error message every time a slug is in conflict, forcing a manual choice
      deconflictSlugs: false
    },

    'apostrophe-db-mongo-3-driver': {},

    'apostrophe-rich-text-permalinks': {
      join: {
        withType: [
          'apostrophe-page',
          'article',
          'book',
          'project',
          'education',
          'event',
          'person',
          'organization',
          'media',
        ]
      }
    },

    'apostrophe-workflow': {
      defaultMode: 'live'
    },

    'apostrophe-search': {
      filters: aposSearchFilters
    },

    ...customModules
  }
};

module.exports = aposOptions;
