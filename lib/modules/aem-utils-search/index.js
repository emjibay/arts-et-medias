module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemSearchUtils',
  label: 'AEM Search Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    buildFilteredUrl,
    getNumFiltersWithResults,
    getNumResultsPerType,
    urlToSearchText,
  });

  function buildFilteredUrl(data, filter) {
    // TODO: handle errors/missing params
    const { slug, query } = data;
    if (filter) {
      return `${ slug }?q=${ query.q }&${ filter }=1`;
    } else {
      return `${ slug }?q=${ query.q }`;
    }
  }

  function getNumFiltersWithResults(data) {
    // TODO: handle errors/missing params
    const results = getNumResultsPerType(data);
    const keys = Object.keys(results);
    let numFilters = 0;
    keys.forEach(key => {
      const value = results[key];
      if (value > 0) {
        numFilters++;
      }
    });
    return numFilters;
  }

  function getNumResultsPerType(data) {
    // TODO: handle errors/missing params
    const rawSum = (
      data.numArticlesInSearchResults
      + data.numBooksInSearchResults
      + data.numProjectsInSearchResults
      + data.numEventsInSearchResults
      + data.numAcademiaInSearchResults
      + data.numPeopleInSearchResults
      + data.numOrgsInSearchResults
      + data.numMediaInSearchResults
      + data.numOthersInSearchResults
    );
    const sumAll = Math.ceil(rawSum / 2); // FIXME: figure out why this is necessary (#110)

    return {
      numArticles: data.numArticlesInSearchResults,
      numBooks: data.numBooksInSearchResults,
      numProjects: data.numProjectsInSearchResults,
      numEvents: data.numEventsInSearchResults,
      numAcademia: data.numAcademiaInSearchResults,
      numPeople: data.numPeopleInSearchResults,
      numOrgs: data.numOrgsInSearchResults,
      numMedia: data.numMediaInSearchResults,
      numOthers: data.numOthersInSearchResults,
      numAll: sumAll,
    };
  }

  function urlToSearchText(url) {
    // TODO: handle errors/missing params
    const parts = url.split('/');
    if (!parts || parts.length < 1) {
      return '';
    }
    const slug = parts[parts.length - 1];
    const decoded = decodeURI(slug);
    const response = decoded.split('-').join(' ');
    return `"${ response }"`;
  }
}
