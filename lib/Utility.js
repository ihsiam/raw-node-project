// dependencies
const crypto = require('crypto');
require('dotenv').config();

// utility object
const utility = {};

// JSON Perser
utility.parseJSON = (data) => {
    let output;

    try {
        output = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        output = {};
    }

    return output;
};

// password hashing
utility.hash = (pass) => {
    const Pass = typeof pass === 'string' && pass.trim().length > 6 ? pass : false;
    const hashPass = crypto.createHmac('sha256', process.env.HASH_KEY).update(Pass).digest('hex');
    return hashPass;
};

// random string generate
utility.randomString = (strLen) => {
    const length = typeof strLen === 'number' && strLen > 0 ? strLen : false;

    if (length) {
        const char = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 0; i < length; i += 1) {
            const ranChar = char.charAt(Math.random() * char.length);
            str += ranChar;
        }
        return str;
    }
    return false;
};

// module export
module.exports = utility;
