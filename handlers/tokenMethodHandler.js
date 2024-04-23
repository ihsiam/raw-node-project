// dependencies
// const { hash, parseJSON } = require('../lib/Utility');
// const fileSystem = require('../lib/fileSystem');

// userHandler obj
const tokenMethodHandler = {};

// create user
tokenMethodHandler.post = (reqObj, callback) => {
    callback(202, {
        msg: 'token page',
    });
};

// get user data
tokenMethodHandler.get = (reqObj, callback) => {
    callback(202, {
        msg: 'token page',
    });
};

// update user data
tokenMethodHandler.put = (reqObj, callback) => {};

// delete user data
tokenMethodHandler.delete = (reqObj, callback) => {};

// module export
module.exports = tokenMethodHandler;
