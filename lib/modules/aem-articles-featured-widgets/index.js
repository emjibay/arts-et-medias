const IsSponsoredField = require('../../fields/is-sponsored.json');


module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-articles',
  label: 'Featured Article',
  searchable: false,
  filters: {
    projection: {
      title: 1,
      heroImage: 1,
      isUsingRemoteImage: 1,
      isSponsored: 1,
      remoteImageLocation: 1,
      remoteImageAltText: 1,
      remoteImageCaption: 1,
      remoteImageCredit: 1,
      remoteImageSource: 1,
      shortDescription: 1,
      citationPublication: 1,
      publicationDate: 1,
      _originalAuthor: 1,
      _url: 1,
    },
  },
  addFields: [
    ...IsSponsoredField,
  ],
};
