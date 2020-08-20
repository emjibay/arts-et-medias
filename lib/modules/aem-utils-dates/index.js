const moment = require('moment');

// import 'moment/locale/fr';


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemDates',
  label: 'AEM Dates Utils',
  construct: constructHelpers
};


function constructHelpers(self, options) {
  self.addHelpers({
    buildAdditionalInfo,
    buildDisplayDate,
    format,
    isPassed,
    isToday,
    isTodayBetween,
  });

  /**
   * @param {object} options
   * - i18n
   * - prefix
   * - startDate
   * - endDate
   */
  function buildAdditionalInfo(options) {
    const { i18n, prefix, startDate, endDate } = options;

    let response = null;

    if (endDate) {
      if (isTodayBetween(startDate, endDate)) {
        response = i18n(prefix + 'now');
      } else if (isPassed(endDate)) {
        response = i18n(prefix + 'passed');
      }

    } else {
      if (isToday(startDate)) {
        response = i18n(prefix + 'today');
      } else if (isPassed(startDate)) {
        response = i18n(prefix + 'passed');
      }
    }

    return response;
  }

  function buildDisplayDate(startDate, endDate, locale) {
    if (endDate) {
      return `${ format(startDate, locale) } — ${ format(endDate, locale) }`;
    } else {
      return `${ format(startDate, locale) }`;
    }
  }

  function format(date, locale) {
    moment.locale(locale);

    let dateFormat;
    switch (locale) {
      case 'fr':
        dateFormat = 'D MMMM, YYYY';
        break;
      case 'en':
      default:
        dateFormat = 'MMM D, YYYY';
    }

    return moment(date).format(dateFormat);
  }

  function isPassed(date) {
    return moment(date).isBefore(moment());
  }

  function isToday(date) {
    return moment().isSame(date, 'day');
  }

  function isTodayBetween(startDate, endDate) {
    return moment().isBetween(moment(startDate), moment(endDate));
  }
}
