const copyField = require('../../utils/copy-field');
const getSearchProps = require('../../utils/get-search-props');
const log = require('../../utils/log');
const toJsonCsl = require('../../utils/to-article-json-csl');

const citationService = require('../../services/citation-service');

const ArticleTypes = require('../../constants/article-types');
const languageHelp = require('../../constants/language-codes-help');
const countryCodeHelp = require('../../constants/country-codes-help');

const HeroImageField = require('../../fields/hero-image.json');
const IsSponsoredField = require('../../fields/is-sponsored.json');
const RelatedEducation = require('../../fields/related-education.json');
const RelatedEvents = require('../../fields/related-events.json');
const RelatedMedia = require('../../fields/related-media.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const RelatedProjects = require('../../fields/related-projects.json');
const ShortDescriptionField = require('../../fields/short-description.json');

const IsSponsoredArticle = copyField(
  IsSponsoredField,
  {
    label: 'Is this article sponsored?',
    help: 'Sponsored content is paid for, otherwise it is simply regular content',
  }
);


const type = 'article';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
  label: 'Article',
  pluralLabel: 'Articles',
  addFields: [
    // basics
    {
      label: 'Publication Date',
      help: 'The original date at which this article was written.',
      name: 'publicationDate',
      type: 'date',
      required: true,
    },
    {
      label: 'Original Author',
      help: '',
      name: '_originalAuthor',
      type: 'joinByArray',
      withType: [
        'person',
        'organization',
        'media',
      ],
      filters: {
        projection: {
          _url: 1,
          title: 1,
          isPrivate: 1,
        },
      },
      required: true,
    },
    {
      label: 'Type',
      htmlHelp: `<p>Choose an article type:</p>
      <p>— Original: the full article is published on Arts & Médias;</p>
      <p>— Mention: the article is published elsewhere, this is an abstract with a link to the original.</p>`,
      name: 'articleType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Mention',
          value: 'mention',
        },
        {
          label: 'Original',
          value: 'original',
        },
      ],
    },
    {
      label: 'External Link',
      help: 'The full URL to the article. Use only if the full article is not published on Arts & Médias.',
      name: 'externalLink',
      type: 'string',
      required: false,
    },

    // metadata
    {
      label: 'Is Private?',
      name: 'isPrivate',
      type: 'boolean',
    },

    // hero image
    {
      label: 'Use Remote Image',
      name: 'isUsingRemoteImage',
      type: 'checkbox',
    },
    {
      label: 'Image Location',
      help: 'The full URL to the image.',
      name: 'remoteImageLocation',
      type: 'string',
      required: true,
    },
    {
      label: 'Image Alt Text',
      name: 'remoteImageAltText',
      type: 'string',
    },
    {
      label: 'Image Caption',
      name: 'remoteImageCaption',
      type: 'string',
      required: true,
    },
    {
      label: 'Image Credit',
      name: 'remoteImageCredit',
      type: 'string',
    },
    {
      label: 'Image Source',
      name: 'remoteImageSource',
      type: 'string',
    },
    {
      label: 'Use Remote Image',
      name: 'isUsingRemoteImage',
      type: 'boolean',
      choices: [
        {
          value: true,
          showFields: [
            'remoteImageLocation',
            'remoteImageAltText',
            'remoteImageCaption',
            'remoteImageCredit',
            'remoteImageSource',
          ],
        },
        {
          value: false,
          showFields: [ 'heroImage' ],
        },
      ],
    },
    {
      label: 'Is image vertical?',
      htmlHelp: '<p>Prefer hero images that are horizontal, since this platform presents them in a horizontal format.</p>'
        + '<p>However, if there is no alternative, you may tick this checkbox to force the display to handle vertical images.</p>',
      name: 'isImageVertical',
      type: 'boolean',
    },

    // lang
    {
      label: 'Is this text a translation?',
      name: 'isTranslation',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
          showFields: [
            '_translator',
          ],
        },
      ],
    },
    {
      label: 'Original Language',
      htmlHelp: '<p>The original language in which the article was written.</p>'
       + `${ languageHelp }`
       + '<p>Note: enter a value <u>only</u> if the language of the article differs from the language in which it is presented on <cite>Arts & Médias</cite>.</p>',
      name: 'originalLang',
      type: 'string',
    },
    {
      label: 'Original Title',
      htmlHelp: '<p>The original title of the article.</p>'
       + '<p>Note: enter a value <u>only</u> if the language of the article differs from the language in which it is presented on <cite>Arts & Médias</cite>.</p>',
      name: 'originalTitle',
      type: 'string',
    },
    {
      label: 'Translator',
      help: '',
      name: '_translator',
      type: 'joinByArray',
      withType: ['person' ],
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },

    // related content
    {
      label: 'Related Articles',
      help: '',
      name: '_relatedArticles',
      type: 'joinByArray',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },
    {
      label: 'Related Books',
      help: '',
      name: '_relatedBooks',
      type: 'joinByArray',
      withType: ['book' ],
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },

    // reverse relations
    {
      name: '_articles',
      reverseOf: '_relatedArticles',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },

    // citations
    {
      label: 'Generate Citations',
      htmlHelp: '<p>Generates the citations on save.</p>'
        + '<p>NOTE 1: Do not set this as "YES" when creating the article. In order to ensure the citations can be generated, the content piece (article) must exist in the database first.</p>'
        + '<p>NOTE 2: If this is set to "NO", the previous citations will be deleted from the database.</p>',
      name: 'hasCitations',
      type: 'select',
      choices: [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
          showFields: [
            'citationType',
            'citationURL',
          ],
        },
      ],
    },
    {
      label: 'Citation Type',
      help: 'The selected type affects the format of the generated citation.',
      name: 'citationType',
      type: 'select',
      required: false,
      choices: [
        {
          label: 'Blog Post',
          value: ArticleTypes.BLOG_POST,
          showFields: [
            'citationPublisher',
          ],
        },
        {
          label: 'Web Page',
          value: ArticleTypes.WEB_PAGE,
          showFields: [
            'citationPublisher',
          ],
        },
        {
          label: 'Magazine Article',
          value: ArticleTypes.MAGAZINE_ARTICLE,
          showFields: [
            'citationPublisher',
            'citationCountry',
            'citationCity',
            'citationVolume',
            'citationIssue',
            'citationISSN',
            'citationPages',
          ],
        },
        {
          label: 'Newspaper Article',
          value: ArticleTypes.NEWSPAPER_ARTICLE,
          showFields: [
            'citationPublisher',
            'citationCountry',
            'citationCity',
            'citationISSN',
            'citationPages',
          ],
        },
        {
          label: 'Conference Paper',
          value: ArticleTypes.CONFERENCE_PAPER,
          showFields: [
            'citationPublisher',
            'citationCountry',
            'citationCity',
            'citationDOI',
            'citationISSN',
          ],
        },
        {
          label: 'Journal Paper',
          value: ArticleTypes.JOURNAL_ARTICLE,
          showFields: [
            'citationPublisher',
            'citationCountry',
            'citationCity',
            'citationVolume',
            'citationIssue',
            'citationDOI',
            'citationISSN',
            'citationPages',
          ],
        },
        {
          label: 'Manuscript',
          value: ArticleTypes.MANUSCRIPT,
          showFields: [
            'citationPublisher',
            'citationCountry',
            'citationCity',
          ],
        },
      ],
    },
    {
      label: 'Publication',
      htmlHelp: '<p>The media or publication which published the content piece.</p>'
      + '<p>For a blog post or a web page, this would be the title of the website.</p>'
      + '<p>For a manuscript (likely an unpublished academic paper), this would be the name of the university.</p>',
      name: 'citationPublication',
      type: 'string',
      required: true,
    },
    {
      label: 'Publisher',
      htmlHelp: '<p>The company which prints the publication/owns the website.</p>',
      name: 'citationPublisher',
      type: 'string',
      required: false,
    },
    {
      label: 'Publisher City',
      name: 'citationCity',
      type: 'string',
      required: false,
    },
    {
      label: 'Publisher Country',
      htmlHelp: countryCodeHelp,
      name: 'citationCountry',
      type: 'string',
      required: false,
    },
    {
      label: 'Volume/Edition',
      name: 'citationVolume',
      type: 'string',
      required: false,
    },
    {
      label: 'Issue',
      name: 'citationIssue',
      type: 'string',
      required: false,
    },
    {
      label: 'DOI',
      name: 'citationDOI',
      type: 'string',
      required: false,
    },
    {
      label: 'ISSN',
      help: 'An International Standard Serial Number is an eight-digit serial number used to uniquely identify a serial publication, such as a magazine.',
      name: 'citationISSN',
      type: 'string',
      required: false,
    },
    {
      label: 'Pages',
      name: 'citationPages',
      type: 'string',
      required: false,
    },
    {
      label: 'URL',
      help: 'The full URL to the article. Use only if you wish to override either the exernal link to the article or the Arts & Médias link.',
      name: 'citationURL',
      type: 'string',
      required: false,
    },

    ...HeroImageField,
    ...IsSponsoredArticle,
    ...RelatedEvents,
    ...RelatedEducation,
    ...RelatedMedia,
    ...RelatedOrganizations,
    ...RelatedPeople,
    ...RelatedProjects,
    ...ShortDescriptionField,
  ],
  arrangeFields: [
    // basics
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'publicationDate',
        '_originalAuthor',
        'articleType',
        'externalLink',
      ],
    },

    // metadata
    {
      label: 'Metadata',
      name: 'meta',
      fields: [
        'shortDescription',
        'tags',
        'isSponsored',
        'isPrivate',
      ],
    },

    // hero image
    {
      label: 'Hero Image',
      name: 'heroImage',
      fields: [
        'isUsingRemoteImage',
        'heroImage',
        'remoteImageLocation',
        'remoteImageAltText',
        'remoteImageCaption',
        'remoteImageCredit',
        'remoteImageSource',
        'isImageVertical',
      ],
    },

    // language
    {
      label: 'Language',
      name: 'language',
      fields: [
        'originalLang',
        'originalTitle',
        'isTranslation',
        '_translator',
      ],
    },

    // related content
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedProjects',
        '_relatedArticles',
        '_relatedBooks',
        '_relatedEvents',
        '_relatedPeople',
        '_relatedOrganizations',
        '_relatedMedia',
        '_relatedEducation',
      ],
    },

    // citations
    {
      label: 'Citations',
      name: 'citations',
      fields: [
        'hasCitations',
        'citationType',
        'citationPublication',
        'citationPublisher',
        'citationCity',
        'citationCountry',
        'citationVolume',
        'citationIssue',
        'citationDOI',
        'citationISSN',
        'citationPages',
        'citationURL',
      ],
    },

    // apos
    {
      label: 'CMS Properties',
      name: 'aposProps',
      fields: [
        'slug',
        'published',
        'trash',
      ],
    },
  ],

  construct: (self, options) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMArticles', async function(req) {
      const searchProps = getSearchProps(
        req,
        {
          props: { type },
        }
      );

      // sorted by pub date
      req.data.articlesByPublicationDate = await apos.docs.getManager(type)
        .find(req, searchProps)
        .sort({ publicationDate: -1 })
        .toArray();

      // sorted by recently added
      req.data.articlesByMostRecent = await apos.docs.getManager(type)
        .find(req, searchProps)
        .sort({ createdAt: -1 })
        .toArray();
    });

    self.on('apostrophe-docs:beforeSave', 'updateCitation', async function(req, piece) {
      // ensure piece
      if (!piece) {
        log.warning('Unable to update citations, no piece found.');
        return;
      }

      // ensure doc type
      if (piece.type !== type) {
        // piece is not an article, ignoring
        return;
      }

      if (!piece.hasCitations) {
        // do not generate citations, delete previous ones
        piece.citations = null;
        return;
      }

      const authorIds = [];
      piece._originalAuthor.forEach(author => {
        authorIds.push(author._id);
      });

      const collection = await apos.db.collection('aposDocs');
      const allDocs = await collection.find({}).toArray();
      const authorDocs = allDocs.filter(doc => authorIds.includes(doc._id));

      const authors = [];
      authorDocs.forEach(doc => {
        if (doc.type === 'person') {
          authors.push({
            type: doc.type,
            title: doc.title,
            firstName: doc.firstName,
            lastName: doc.lastName,
          });
        } else {
          authors.push({
            type: doc.type,
            title: doc.title,
          });
        }
      });

      // create csl
      const locale = req.getLocale().substr(0, 2);
      const csl = toJsonCsl(piece, { authors, locale });

      // fetch citations
      const apa = await citationService.getAPA(csl, locale);
      const bibtex = await citationService.getBibTex(csl, locale);
      const chicago = await citationService.getChicago(csl, locale);
      const mla = await citationService.getMLA(csl, locale);

      piece.citations = { apa, bibtex, chicago, mla };
    });
  },
};
