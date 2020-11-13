const Cite = require('citation-js');

const CitationStyleIds = require('../constants/citation-styles/citation-style-ids');
const CitationStyles = require('../constants/citation-styles/citation-styles');

const log = require('../utils/log');


let service = null;


module.exports = {
  getAPA,
  getBibTex,
  getChicago,
  getMLA,
};


// public methods
async function getAPA(csl, locale) {
  return await formatCitation(
    csl,
    'bibliography',
    {
      format: 'html',
      template: CitationStyleIds.APA,
      lang: localizeLanguage(locale),
    }
  );
}

async function getBibTex(csl, locale) {
  let citation = await formatCitation(
    csl,
    CitationStyleIds.BIBTEX,
    { lang: localizeLanguage(locale) }
  );

  // eslint-disable-next-line no-control-regex
  const tab = new RegExp('\t', 'g');
  citation = citation.replace(tab, '  ');

  return citation;
}

async function getChicago(csl, locale) {
  return await formatCitation(
    csl,
    'bibliography',
    {
      format: 'html',
      template: CitationStyleIds.CHICAGO,
      lang: localizeLanguage(locale),
    }
  );
}

async function getMLA(csl, locale) {
  return await formatCitation(
    csl,
    'bibliography',
    {
      format: 'html',
      template: CitationStyleIds.MLA,
      lang: localizeLanguage(locale),
    }
  );
}


// private methods
async function formatCitation(csl, format, options) {
  const isBibTex = format === CitationStyleIds.BIBTEX;

  if (!isBibTex) {
    // cache to avoid fetching at every call
    const styleConfig = Cite.plugins.config.get('@csl');
    const templateKeys = Object.keys(styleConfig.templates.data);
    if (!templateKeys.includes(options.template)) {
      const style = CitationStyles.find(s => s.id === options.template);

      // no style data, fetch it
      const styleData = await Cite.util.fetchFileAsync(style.url);

      // save it
      styleConfig.templates.add(options.template, styleData);
    }
  }

  service = getService(csl);

  let response = null;
  try {
    response = service.format(format, options);
  } catch (error) {
    log.critical(
      'formatCitation() is unable format citation.',
      error
    );
    response = '';
  }

  return response;
}

function getService(csl) {
  if (!service) {
    service = new Cite(csl);

  } else {
    try {
      service = service.reset();
      service.set(csl);

    } catch (error) {
      log.critical(
        'getService() is unable to reset the citation service',
        error
      );

      service = null;
    }
  }

  return service;
}

function localizeLanguage(lang) {
  if (lang.toLowerCase() === 'fr') {
    return 'fr-FR';
  }

  return 'en-CA';
}
