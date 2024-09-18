//@ts-check
'use-strict'

const fs = require('fs');
const path = require('path');


/**
 * 
 * @param {string} dir 
 * @param {string[]} filelist 
 * @returns {string[]}
 */
let readRecursiveDirectory = (dir, filelist = ['']) => {
    try {
        let pathDir = path.join(process.cwd(), 'src', dir);
        let files = fs.readdirSync(pathDir);
        filelist = filelist.length ? filelist : [''];
        files.forEach((file) => {
            if (fs.statSync(path.join(pathDir, file)).isDirectory()) {
                filelist = readRecursiveDirectory(path.join(dir, file), filelist);
            } else {
                filelist.push(path.join(dir, file));
            }
        });
    } catch (e) {
        throw e;
    }
    return filelist;
};

/**
 * 
 * @param {string} dir 
 * @param {string[]} filelist
 * @returns {string[]}
 */
let readRecursiveFile = (dir, filelist = ['']) => {
    try {
        let pathDir = path.join(process.cwd(), 'src', dir);
        let files = fs.readdirSync(pathDir);
        filelist = filelist.length ? filelist : [''];
        files.forEach((file) => {
            if (fs.statSync(path.join(pathDir, file)).isDirectory()) {
                filelist = readRecursiveFile(path.join(dir, file), filelist);
            } else {
                filelist.push(file);
            }
        });
    } catch (e) {
        console.log(e);
    }
    return filelist;
};

/**
 * 
 * @param {Object} obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

/**
 * 
 * @param {Object} user
 * @returns {Object}
 */
function parseUser(user) {
    if (!user || typeof(user) !== 'object') {
        return {
            name: 'N/A',
            enrollment: 'N/A',
            site: 'N/A'
        }
    }
    return {
        name: user.name,
        enrollment: user.enrollment,
        site: user.site
    }
}

/**
 * 
 * @param {number} w
 * @param {number} y
 */
function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}


module.exports.readRecursiveFile = readRecursiveFile;
module.exports.readRecursiveDirectory = readRecursiveDirectory;
module.exports.isEmptyObject = isEmptyObject;
module.exports.parseUser = parseUser;
module.exports.getDateOfISOWeek = getDateOfISOWeek;