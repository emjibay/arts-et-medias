const _ = require('lodash');
const async = require('async');

const ContentTypes = require('../../constants/content-types');


const filterToCountKeyMap = {
  article: 'numArticlesInSearchResults',
  book: 'numBooksInSearchResults',
  project: 'numProjectsInSearchResults',
  event: 'numEventsInSearchResults',
  education: 'numAcademiaInSearchResults',
  person: 'numPeopleInSearchResults',
  organization: 'numOrgsInSearchResults',
  media: 'numMediaInSearchResults',
  __else: 'numOthersInSearchResults',
};
const queryToFiltersMap = generateQueryToFilterMap();
const queryFilters = Object.keys(filterToCountKeyMap);
const countKeys = _.values(filterToCountKeyMap);


module.exports = {
  alias: 'aemSearch',
  filters: [
    { name: ContentTypes.ARTICLE },
    { name: ContentTypes.BOOK },
    { name: ContentTypes.PROJECT },
    { name: ContentTypes.EVENT },
    { name: ContentTypes.EDUCATION },
    { name: ContentTypes.PERSON },
    { name: ContentTypes.ORGANIZATION },
    { name: ContentTypes.MEDIA },
    { name: '__else' },
  ],
  construct: construct,
};


// private methods
function construct(self, options) {
  const superIndexPage = self.indexPage;

  self.indexPage = (req, callback) => {
    const { query } = req;

    query.search = query.search || query.q;

    req.data.activeFilter = getActiveFilter(query);

    if (query.search && !queryFilters.some(f => f in query)) {
      self.countDocuments(
        req,
        () => superIndexPage(req, callback)
      );
    } else {
      return superIndexPage(req, callback);
    }
  };

  self.countDocuments = (req, callback) => {
    if (!(req.query.q || req.query.search)) {
      return callback(null);
    }

    const [[activeFilter], inactiveFilters] = _.partition(queryFilters, k => k in req.query);

    const activeCountKey = filterToCountKeyMap[activeFilter];
    req.data[activeCountKey] = req.data.totalDocs;

    async.parallel(
      inactiveFilters.map(f => cb => countDocsMatchingSearch(req, f, cb)),

      (err, docCounts) => {
        docCounts.forEach(
          (count, index) => {
            const filterName = inactiveFilters[index];
            const countKey = filterToCountKeyMap[filterName];

            req.data[countKey] = count;
          }
        );

        return callback(null);
      }
    );
  };

  self.beforeIndex = (req, callback) => {
    // Get the count of all other types
    // This occurs *after* indexPage
    if (countKeys.every(ck => ck in req.data)) {
      // All types are already counted, nothing to do.
      return callback(null);
    } else {
      return self.countDocuments(req, callback);
    }
  };


  function countDocsMatchingSearch(req, queryType, callback) {
    let allowedTypes;

    if (queryType === '__else') {
      const filterTypes = self.filters
        .map(({ name }) => name)
        .filter(name => name !== '__else');

      allowedTypes = _.difference(self.types, filterTypes);
    } else {
      allowedTypes = queryToFiltersMap[queryType];
    }

    const typeMongoQuery = Array.isArray(allowedTypes)
      ? { type: { $in: allowedTypes } }
      : { type: allowedTypes };

    const fakeQueryParams = _.pick(req.query, ['q', 'search']);

    self.apos.docs.find(req, {})
      .queryToFilters(fakeQueryParams, 'public')
      .and(typeMongoQuery)
      .toCount(callback);
  }
}

// utils
function generateQueryToFilterMap() {
  let response = {};

  // gather content types
  Object.keys(ContentTypes).forEach(key => {
    const type = ContentTypes[key];
    response[type] = type;
  });

  // append __else
  response.__else = '__else';

  return response;
}

function getActiveFilter(query) {
  if (query.__else && query.__else === '1') {
    return 'other';
  }

  const types = Object.values(ContentTypes);
  let response = '';
  types.forEach(type => {
    if (query[type] && query[type] === '1') {
      response = type;
    }
  });
  return response;
}
