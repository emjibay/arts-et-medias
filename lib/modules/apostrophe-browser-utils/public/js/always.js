/* global apos */


// TODO: investigate how to externalize. note: this happens in-browser (#92)
const stopWords = {
  en: [ 'a', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'both', 'but', 'by', 'did', 'do', 'does', 'down', 'each', 'few', 'for', 'from', 'had', 'has', 'have', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me', 'more', 'most', 'my', 'nor', 'of', 'on', 'once', 'only', 'or', 'our', 'ours', 'out', 'over', 'own', 'same', 'she', 'so', 'some', 'such', 'than', 'that', 'the', 'them', 'then', 'they', 'this', 'to', 'too', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'who', 'whom', 'why', 'with', 'you', 'your' ],
  fr: [ 'a', 'alors', 'au', 'aucun', 'aussi', 'autre', 'avec', 'avoir', 'bon', 'c', 'ça', 'car', 'ce', 'cela', 'ces', 'ceux', 'chaque', 'ci', 'comme', 'd', 'dans', 'dedans', 'des', 'doit', 'donc', 'dos', 'du', 'elle', 'elles', 'en', 'encore', 'est', 'et', 'étaient', 'état', 'été', 'étions', 'être', 'eu', 'fait', 'faites', 'fois', 'font', 'hors', 'ici', 'il', 'ils', 'je', 'juste', 'l', 'la', 'là', 'le', 'les', 'leur', 'ma', 'm', 'maintenant', 'mais', 'même', 'mes', 'mien', 'moins', 'mon', 'ni', 'notre', 'nous', 'ou', 'où', 'par', 'parce', 'pas', 'peut', 'pour', 'quand', 'que', 'quel', 'quelle', 'quelles', 'quels', 'qui', 'qu', 's', 'sa', 'sans', 'ses', 'seulement', 'si', 'sien', 'son', 'sont', 'sous', 'soyez', 'sujet', 'sur', 't', 'ta', 'tandis', 'tellement', 'tels', 'tes', 'ton', 'tous', 'tout', 'très', 'trop', 'tu', 'voient', 'vont', 'votre', 'vous', 'vu' ],
};


apos.define('apostrophe-browser-utils', {
  construct: function(self, options) {
    const superSlugify = self.slugify;

    self.slugify = function(source, slugifyOptions) {
      // generate slug
      const slug = superSlugify(source, slugifyOptions);

      // remove stop words
      const withStopWords = slug.split('-');
      const localeStopWords = getLocaleStopWords();
      const withoutStopWords = [];
      withStopWords.forEach(word => {
        // add words that arent stop words
        if (localeStopWords.indexOf(word) === -1) {
          withoutStopWords.push(word);
        }
      });
      const slugWithoutStopWords = withoutStopWords.join('-');

      // remove accents
      const slugWithoutAccents = slugWithoutStopWords.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      return slugWithoutAccents;
    };
  },
});

function getLocaleStopWords() {
  let response = [];

  if (!document) {
    return response;
  }
  const { documentElement } = document;
  if (!documentElement) {
    return response;
  }
  const { lang } = documentElement;
  if (!lang) {
    return response;
  }

  try {
    response = stopWords[lang];
    return response;
  } catch (error) {
    console.error('Unable to fetch stop words for locale.');
    return [];
  }
}
