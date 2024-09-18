//@ts-check
'use strict';

const mongoose = require('mongoose');
const utils = require('./utils');

function connectMongo() {

    return new Promise((resolve, reject) => {
        let MONGODB = {};
        if (typeof process.env.MONGODB === 'string' && process.env.MONGODB !== '') {

            // mongoose.set('useCreateIndex', true)
            MONGODB.uri = process.env.MONGODB
            console.log(MONGODB.uri);


            logMongoOptions(MONGODB);

            // When successfully connected
            mongoose.connection.on('connected', function () {
                console.log('Mongoose default connection open to ' + MONGODB.uri);
            });

            // If the connection throws an error
            mongoose.connection.on('error', function (err) {
                console.log('Mongoose default connection error: ' + err);
            });

            // When the connection is disconnected
            mongoose.connection.on('disconnected', function () {
                console.log('Mongoose default connection disconnected');
            });

            mongoose.connect(
                MONGODB.uri, { useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false },
                err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        } else {
            throw Error(`Can't find connection string to mongodb`);
        }
    });
}

/**
 *
 * @param {Object} MONGODB
 */
function logMongoOptions(MONGODB) {
    /**
     * inicio do mascaramento da senha
     */
    let passMask = "";
    let strf = "";
    try {
        passMask = MONGODB.options.pass;
        if (passMask.length > 2) {
            let metadeint = passMask.length / 2;
            let metade = passMask.substr(metadeint);
            passMask = "X".repeat(passMask.length - metadeint) + metade;
        }
        const strj = JSON.stringify(MONGODB);
        const pwdi = strj.indexOf("\"pass\":");
        const pwde = strj.substr(pwdi).indexOf(",") + pwdi;
        const pwdf = strj.substr(0, pwdi + 8);
        const strx = strj.substr(pwde - 1);
        strf = pwdf + passMask + strx;
        strf = JSON.stringify(
            JSON.parse(strf),
            null,
            4
        );
    } catch (e) {
        passMask = "X".repeat(6);
    }
    console.log(`Conectando no MongoDB com as opções: ${strf}`);
    /**
     * fim do mascaramento da senha
     */
}

/**
 *
 * @param {string} modelFolder
 */
module.exports.init = async modelFolder => {
    try {
        await connectMongo();

        let fileModels = utils
            .readRecursiveDirectory(modelFolder)
            .filter(item => {
                return item !== '';
            });
        fileModels.forEach(file => {
            let m = file.replace('.js', '');
            require('../' + m);
           
        });
    } catch (err) {
        console.log(`Error: ${err}`);
    }
};