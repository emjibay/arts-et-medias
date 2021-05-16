module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemBooks',
  label: 'AEM Books Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    getAPA,
    getBibTex,
    getChicago,
    getFullTitle,
    getMLA,
  });

  // citations
  function getAPA(piece, citations) {
    const citation = citations.find(c => c._id === piece._id);
    if (citation && 'apa' in citation) {
      return citation.apa;
    } else {
      return '';
    }
  }

  function getBibTex(piece, citations) {
    const citation = citations.find(c => c._id === piece._id);
    if (citation && 'bibtex' in citation) {
      return citation.bibtex;
    } else {
      return '';
    }
  }

  function getChicago(piece, citations) {
    const citation = citations.find(c => c._id === piece._id);
    if (citation && 'chicago' in citation) {
      return citation.chicago;
    } else {
      return '';
    }
  }

  function getMLA(piece, citations) {
    const citation = citations.find(c => c._id === piece._id);
    if (citation && 'mla' in citation) {
      return citation.mla;
    } else {
      return '';
    }
  }

  // utils
  function getFullTitle(piece, lang) {
    if (!piece) {
      return '';
    }

    let title = '';
    if (!piece.subtitle) {
      title = piece.title;
    } else {
      let separator = '';
      if (lang.toLowerCase() === 'fr') {
        separator = ' : ';
      } else {
        separator = ': ';
      }
      title = `${ piece.title }${ separator }${ piece.subtitle }`;
    }
    return title;
  }
}
