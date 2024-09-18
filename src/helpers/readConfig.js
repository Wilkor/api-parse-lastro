//@ts-check
'use-strict'
const path = require('path');
module.exports.readEnvFile = () => {

    try {
        require('dotenv')
            .config({
                path: path.resolve(process.cwd(),'./environment/.env')
            });


    } catch (e) {
        console.log(e);
    }
};