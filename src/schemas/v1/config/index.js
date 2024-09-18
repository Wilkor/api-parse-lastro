const mongoose = require('mongoose');

const configSchemaLastro = new mongoose.Schema({
    app: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    }
}, { collection: 'configSchemaLastro' });

module.exports.schema = configSchemaLastro;