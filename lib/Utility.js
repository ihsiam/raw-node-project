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
    const hashPass = crypto.createHmac('sha256', process.env.HASH_KEY).update(pass).digest('hex');
    return hashPass;
};

// module export
module.exports = utility;
