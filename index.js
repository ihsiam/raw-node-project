// dependencies
const http = require('http');
const { handleReqRes } = require('./handlers/handleReqRes');
require('dotenv').config();

// app object
const app = {};

// port define
const port = process.env.PORT || 5000;

// handle request & response
app.handleReqRes = handleReqRes;

// create server
app.Server = () => {
    const createServer = http.createServer(app.handleReqRes);
    createServer.listen(port, () => {
        console.log(`Server is running at: http://localhost:${port}`);
    });
};

// start the server
app.Server();
