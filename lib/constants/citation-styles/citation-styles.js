const fs = require('fs');
const CitationStyleIds = require('./citation-style-ids');


const zoteroUrl = 'https://zotero.org';


module.exports = [
  {
    id: CitationStyleIds.APA,
    label: 'APA',
    url: `${zoteroUrl}/styles/apa`,
    template: getCSL('./apa.csl'),
  },
  {
    id: CitationStyleIds.CHICAGO,
    label: 'Chicago',
    url: `${zoteroUrl}/styles/chicago-fullnote-bibliography`,
    template: getCSL('./chicago-fullnote-bibliography.csl'),
  },
  {
    id: CitationStyleIds.MLA,
    label: 'MLA',
    url: `${zoteroUrl}/styles/modern-language-association`,
    template: getCSL('./modern-language-association.csl'),
  },
];


async function getCSL(path) {
  return new Promise(
    (resolve, reject) => {
      fs.readFile(
        `${__dirname}/${path}`,
        (error, buffer) => {
          let style;
          if (error) {
            style = null;
          } else {
            style = buffer.toString('utf8');
          }
          resolve(style);
        }
      );
    }
  );
}
