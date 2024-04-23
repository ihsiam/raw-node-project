// dependencies
const userMethodHandler = require('./userMethodHandler');
const tokenMethodHandler = require('./tokenMethodHandler');

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

// not found
routerHandler.notFoundHandler = (reqObj, callback) => {
    callback(404, {
        msg: 'Page not found',
    });
};

// export module
module.exports = routerHandler;
