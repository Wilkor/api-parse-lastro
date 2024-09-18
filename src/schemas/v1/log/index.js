const mongoose = require('mongoose');

let LogLais = new mongoose.Schema({

    createdAt: {
        index: true,
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
    },
    error: {
        type: String,
        required: true,
        index: true
    },
    path: {
        type: String,
        required: true,
        index: true
    },
    payload:{
        type: String,
        required: true,
    }

}, { collection: 'LogLais' });

module.exports.schema = LogLais;