'use strict';
const mongoose = require('mongoose');
const scm = require('../../../schemas/v1/log');

module.exports = mongoose.model('LogLais', scm.schema);