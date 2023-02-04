const _ = require('lodash');
const async = require('async');

const ContentTypes = require('../../constants/content-types');

const isUserInGroup = require('../../utils/is-user-in-group');

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
  self.indexPage = (req, callback) => {
    const { query } = req;

    query.search = query.search || query.q;

    req.data.activeFilter = getActiveFilter(query);


    // TODO: adapt apostrophe-search 
    // e.g. var cursor = self.apos.docs.find(req, { isPrivate: true })


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


  function superIndexPage(req, callback) {
    // NOTE: Extracted from node_modules/apostrophe/lib/modules/apostrophe-search/index.js

    // Finesse so we can use queryToFilters but we still support q, which is
    // a common expectation/preference
    req.query.search = req.query.search || req.query.q;

    // Cope with filters
    var allowedTypes;

    var defaultingToAll = false;

    var cursor = self.apos.docs.find(req, getSearchProps(req))
      .queryToFilters(req.query, 'public')
      .perPage(self.perPage);
    if (self.filters) {
      var filterTypes = _.filter(
        _.map(self.filters, 'name'),
        function(name) {
          return name !== '__else';
        }
      );
      allowedTypes = _.filter(self.types, function(name) {
        return _.has(req.query, name);
      });
      if (req.query.__else) {
        allowedTypes = allowedTypes.concat(_.difference(self.types, filterTypes));
      }
      if (!allowedTypes.length) {
        // Default is everything
        defaultingToAll = true;
        allowedTypes = self.types;
      }
    } else {
      allowedTypes = self.types;
    }
    cursor.and({ type: { $in: allowedTypes } });

    var docs = [];

    if (self.filters) {
      req.data.filters = _.cloneDeep(self.filters);

      _.each(req.data.filters, function(filter) {
        if (defaultingToAll || req.query[filter.name]) {
          filter.value = true;
        }
      });
    }

    return async.series([ totalDocs, findDocs ], function(err) {

      if (err) {
        return callback(err);
      }

      if (self.apos.utils.isAjaxRequest(req)) {
        req.template = self.renderer('indexAjax');
      } else {
        req.template = self.renderer('index');
      }
      req.data.currentPage = cursor.get('page');
      req.data.docs = docs;

      return self.beforeIndex(req, callback);
    });

    function totalDocs(callback) {
      return cursor.toCount(function(err, count) {
        if (err) {
          return callback(err);
        }
        if (cursor.get('page') > cursor.get('totalPages')) {
          req.notFound = true;
          return callback(null);
        }
        req.data.totalDocs = count;
        req.data.totalPages = cursor.get('totalPages');
        return callback();
      });
    }

    function findDocs(callback) {

      // Polymorphic find: fetch just the ids at first, then go back
      // and fetch them via their own type managers so that we get the
      // expected joins and urls and suchlike.

      var idsAndTypes;
      var byType;

      return async.series([
        getIdsAndTypes,
        getDocs,
      ], callback);

      function getIdsAndTypes(callback) {
        return cursor.projection({ _id: 1, type: 1 }).toArray(function(err, _idsAndTypes) {
          if (err) {
            return callback(err);
          }
          idsAndTypes = _idsAndTypes;
          return callback(null);
        });
      }

      function getDocs(callback) {
        byType = _.groupBy(idsAndTypes, 'type');
        return async.eachSeries(_.keys(byType), getDocsOfType, function(err) {
          if (err) {
            return callback(err);
          }
          // Restore the intended order ($in doesn't respect it and neither does
          // fetching them all by type). ACHTUNG: without this search quality goes
          // right out the window. -Tom
          docs = self.apos.utils.orderById(_.map(idsAndTypes, '_id'), docs);
          return callback(null);
        });
      }

      function getDocsOfType(type, callback) {
        var manager = self.apos.docs.getManager(type);
        if (!manager) {
          return setImmediate(callback);
        }
        return manager.find(req,
          {
            type: type,
            _id: {
              $in: _.map(byType[type], '_id'),
            },
          }
        ).toArray(function(err, docsOfType) {
          if (err) {
            return callback(err);
          }
          docs = docs.concat(docsOfType);
          return callback(null);
        });
      }

    }
  }

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

    self.apos.docs.find(req, getSearchProps(req))
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

function getSearchProps(req) {
  const isAdmin = isUserInGroup(req.data.user, 'admin');

  if (isAdmin) {
    return {};
  }

  return { isPrivate: false || null || undefined };
}
