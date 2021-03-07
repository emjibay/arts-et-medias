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
    const { slug, query } = data;
    if (filter) {
      return `${slug}?q=${query.q}&${filter}=1`;
    } else {
      return `${slug}?q=${query.q}`;
    }
  }

  function getNumFiltersWithResults(data) {
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
    };
  }

  function urlToSearchText(url) {
    const parts = url.split('/');
    if (!parts || parts.length < 1) {
      return '';
    }
    const slug = parts[parts.length - 1];
    const response = decodeURI(slug);
    return response;
  }
}
