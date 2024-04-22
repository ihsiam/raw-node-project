// handler object
const routerHandler = {};

// sample
routerHandler.sampleHandler = (reqObj, callback) => {
    console.log(reqObj);
    callback(200, {
        msg: 'Sample Page',
    });
};

// not found
routerHandler.notFoundHandler = (reqObj, callback) => {
    callback(404, {
        msg: 'Page not found',
    });
};

// export module
module.exports = routerHandler;
