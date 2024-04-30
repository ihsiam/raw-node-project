// dependencies
const http = require('http');
const handleReqRes = require('../handlers/handleReqRes');
require('dotenv').config();

// server obj
const server = {};

// port define
const port = process.env.PORT || 5000;

// handle request & response
server.handleReqRes = handleReqRes;

// create server
server.Server = () => {
    const createServer = http.createServer(server.handleReqRes);
    createServer.listen(port, () => {
        console.log(`Server is running at: http://localhost:${port}`);
    });
};

// init
server.init = () => {
    server.Server();
};

// module export
module.exports = server;
