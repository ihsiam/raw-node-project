// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const route = require('../routes/router');
const { notFoundHandler } = require('./routerHandler');

// handler object
const handler = {};

// req res handle
handler.handleReqRes = (req, res) => {
    // get url, query, method, header
    const parseURL = url.parse(req.url, true);
    const pathName = parseURL.pathname;
    const queryStringObj = parseURL.query;
    const method = req.method.toLowerCase();
    const headerObj = req.headers;

    // req properties objeect
    const reqObj = {
        pathName,
        queryStringObj,
        method,
        headerObj,
    };

    // get all pathName in a common format
    const treamedPath = pathName.replace(/^\/+|\/+$/g, '');
    // get body data
    const decoder = new StringDecoder('utf-8');
    let data = '';

    req.on('data', (buffer) => {
        data += decoder.write(buffer);
    });

    req.on('end', () => {
        data += decoder.end();
        console.log(data);

        // connect to routing handler
        const chosenHandler = route[treamedPath] ? route[treamedPath] : notFoundHandler;

        chosenHandler(reqObj, (statusCode, payload) => {
            // type check
            const StatusCode = typeof statusCode === 'number' ? statusCode : 500;
            const Payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(Payload);

            // response send
            res.writeHead(StatusCode);
            res.end(payloadString);
        });
    });
};

// module export
module.exports = handler;
