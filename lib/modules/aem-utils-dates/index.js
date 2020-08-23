const moment = require('moment');

const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemDates',
  label: 'AEM Dates Utils',
  construct,
};


function construct(self) {
  self.addHelpers({
    buildAdditionalInfo,
    buildDisplayDate,
    format,
    isPassed,
    isToday,
    isTodayBetween,
    toISOString,
  });

  /**
   * @param {object} options
   * - i18n
   * - prefix
   * - startDate
   * - endDate
   */
  function buildAdditionalInfo(options) {
    const { i18n, prefix, startDate, endDate, } = options;

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

  function toISOString(date) {
    // no param
    if (!date) {
      log.warning(
        'toISOString() expected a date, but none was provided. '
        + 'A new one will be created instead.'
      );
      return new Date().toISOString();
    }

    // param not a date
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      throw new Error(
        `'toISOString() expected a date, but was provided "${ typeof date} instead." `
      );
    }

    return new Date(date).toISOString();
  }
}
