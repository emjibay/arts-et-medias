const _ = require('lodash');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemSeo',
  label: 'AEM SEO Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    buildCategoryIndex,
    buildPieceWithCategory,
    buildPieceWithType,
    buildSimplePageTitle,
    buildWrittenBy,
  });

  function buildSimplePageTitle(__, title) {
    return `${ title } | ${ __('global|title') }`;
  }

  function buildPieceWithType(__, title, type) {
    return `${ title } - ${ _.capitalize(type) } | ${ __('global|title') }`;
  }

  /* eslint-disable max-params */
  // TODO: refactor? (#89)
  function buildPieceWithCategory(__, title, type, category) {
    return `${ title } - ${ _.capitalize(category) } - ${ _.capitalize(type) } | ${ __('global|title') }`;
  }
  /* eslint-enable max-params */

  function buildCategoryIndex(__, type, category) {
    return `${ _.capitalize(category) } - ${ _.capitalize(type) } | ${ __('global|title') }`;
  }

  function buildWrittenBy(title, author, locale) {
    // error checks
    const errorMessage = 'buildWrittenBy() expects `locale`, a two-letter language code, as third parameter. ';
    if (!locale) {
      throw new Error(errorMessage);
    }
    if (typeof locale !== 'string') {
      throw new Error(
        errorMessage
        + `The type provided was "${ typeof locale }"`
      );
    }

    switch (locale.toLowerCase()) {
    case 'fr':
      return `${ title }, par ${ author }`;
    case 'en':
    default:
      return `${ title }, by ${ author }`;
    }
  }
}
