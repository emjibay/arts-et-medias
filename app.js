'use strict';

require('dotenv').config();

const apostrophe = require('apostrophe');
const aposOptions = require('./apos-config');
const apos = apostrophe(aposOptions);

module.exports = apos;
