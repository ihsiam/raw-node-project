// dependencies
const userMethodHandler = require('./userMethodHandler');
const tokenMethodHandler = require('./tokenMethodHandler');
const checkMethodHandler = require('./checkMethodHandler');
const fileSystem = require('../lib/fileSystem');
const { tokenVerify } = require('./tokenMethodHandler');
const { parseJSON } = require('../lib/Utility');

// handler object
const routerHandler = {};

// home
routerHandler.homePageHandler = (reqObj, callback) => {
    callback(200, {
        msg: 'Home Page',
    });
};

// user
routerHandler.userHandler = (reqObj, callback) => {
    const method = ['get', 'post', 'put', 'delete'];
    if (method.indexOf(reqObj.method) > -1) {
        userMethodHandler[reqObj.method](reqObj, callback);
    } else {
        callback(405);
    }
};

// token
routerHandler.tokenHandler = (reqObj, callback) => {
    const method = ['get', 'post', 'put', 'delete'];
    if (method.indexOf(reqObj.method) > -1) {
        tokenMethodHandler[reqObj.method](reqObj, callback);
    } else {
        callback(405);
    }
};

// check
routerHandler.checkHandler = (reqObj, callback) => {
    const method = ['get', 'post', 'put', 'delete'];
    if (method.indexOf(reqObj.method) > -1) {
        // verify & procced
        const { tokenid } = reqObj.headerObj;
        // eslint-disable-next-line operator-linebreak
        const TokenId =
            typeof tokenid === 'string' && tokenid.trim().length === 20 ? tokenid : false;
        fileSystem.read('tokens', TokenId, (tokenReadErr, data) => {
            if (!tokenReadErr && data) {
                const { Phone } = parseJSON(data);

                fileSystem.read('users', Phone, (userReadErr, userData) => {
                    if (!userReadErr && userData) {
                        tokenVerify(TokenId, Phone, (verify) => {
                            if (verify) {
                                checkMethodHandler[reqObj.method](reqObj, userData, callback);
                            } else {
                                callback(400, {
                                    msg: 'Auth problem',
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            msg: 'User not found',
                        });
                    }
                });
            } else {
                callback(400, {
                    msg: 'Token not found',
                });
            }
        });
    } else {
        callback(405);
    }
};

// not found
routerHandler.notFoundHandler = (reqObj, callback) => {
    callback(404, {
        msg: 'Page not found',
    });
};

// export module
module.exports = routerHandler;
