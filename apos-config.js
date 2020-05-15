'use strict';

const path = require('path');
const fs = require('fs');


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

    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },

    'apostrophe-docs': {
      // present clear error message every time a slug is in conflict, forcing a manual choice
      deconflictSlugs: false
    },

    // 'apostrophe-attachments': {
    //   uploadfs: {
    //     https: true
    //   }
    // },

    'apostrophe-db-mongo-3-driver': {},

    'apostrophe-workflow': {},

    'apostrophe-second-chance-login': {},

    'apostrophe-search': {
      filters: [
        // content
        {
          name: 'aem-articles',
          label: 'News'
        },
        {
          name: 'aem-events',
          label: 'Events'
        },
        {
          name: 'aem-projects',
          label: 'Projects'
        },
        // media
        {
          name: 'aem-media',
          label: 'Medias'
        },
        {
          name: 'aem-books',
          label: 'Books'
        },
        // people and orgs
        {
          name: 'aem-persons',
          label: 'People'
        },
        {
          name: 'aem-organizations',
          label: 'Organizations'
        },
        // education
        {
          name: 'aem-education',
          label: 'Education'
        },
        // other
        {
          name: '__else',
          label: 'Pages'
        }
      ]
    },

    ...customModules
  }
};

module.exports = aposOptions;
