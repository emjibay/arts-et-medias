'use strict';

module.exports = {
  // modules that extend richtext can override this.
  sanitizeHtml: {
    allowedTags: [
      // headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // blocks
      'blockquote', 'p',
      'ul', 'ol', 'li',
      'hr', 'br', 'div',
      // inline
      'a', 'span', 'cite', 'code', 'sup', 'sub',
      // styles
      'strong', 'em', 'strike', 'b', 'i', 'u',
      // elements
      'caption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'pre',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      p: ['class'],
      span: ['class'],
      h1: ['class'],
      h2: ['class'],
      h3: ['class'],
      h4: ['class'],
      h5: ['class'],
      h6: ['class'],
      '*': ['style'],
    },
    // lots of these won't come up by default because we don't allow them
    selfClosing: [
      'img', 'br', 'hr', 'area', 'base', 'basefont',
      'input', 'link', 'meta',
    ],
    // url schemes we permit
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {},
  },
};
