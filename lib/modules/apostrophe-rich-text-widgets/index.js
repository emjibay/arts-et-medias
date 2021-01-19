'use strict';

module.exports = {
  // modules that extend richtext can override this.

  // the standard list copied from the default module, plus h1 / h2
  sanitizeHtml: {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'p', 'a', 'ul', 'ol',
      'span', 'sup',
      'li', 'b', 'i', 'u', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel' ],
      p: ['class' ],
      span: ['class' ],
      h1: ['class' ],
      h2: ['class' ],
      h3: ['class' ],
      h4: ['class' ],
      h5: ['class' ],
      h6: ['class' ],
      '*': ['style' ],
    },
    // lots of these won't come up by default because we don't allow them
    selfClosing: [
      'img', 'br', 'hr', 'area', 'base', 'basefont',
      'input', 'link', 'meta',
    ],
    // url schemes we permit
    allowedSchemes: ['http', 'https', 'mailto' ],
    allowedSchemesByTag: {},
  },
};
