'use strict';
const mongoose = require('mongoose');
const scm = require('../../../schemas/v1/config');

module.exports = mongoose.model('configSchemaLastro', scm.schema);