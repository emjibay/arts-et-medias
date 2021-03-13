module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemPagination',
  label: 'AEM Pagination Utils',
  construct,
};

function construct(self, options) {
  self.addHelpers({
    getCurrentPage,
    getNumPages,
  });

  function getCurrentPage(data, options) {
    const defaultResponse = 1;

    const { url } = data;
    const sansHash = url.split('#')[0];
    const paramString = sansHash.split('?')[1];

    if (!paramString) {
      return defaultResponse;
    }

    const paramsToSplit = paramString.split('&');

    let params = {};
    paramsToSplit.forEach(p => {
      const tuple = p.split('=');
      params[tuple[0]] = tuple[1];
    });

    let response = parseInt(params.page, 10);

    if (response && response > 0) {
      const { max } = options;
      if (max) {
        if (response > max) {
          response = max;
        }
      }
    } else {
      response = defaultResponse;
    }

    return response;
  }

  function getNumPages(pieces, options) {
    if (!pieces || !Array.isArray(pieces)) {
      return 0;
    }

    let perPage = 10;
    if (options && options.perPage && typeof options.perPage === 'number') {
      perPage = options.perPage;
    }

    return Math.ceil(pieces.length / perPage);
  }
}
