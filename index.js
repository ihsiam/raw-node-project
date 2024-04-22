// dependencies
const http = require('http');
const { handleReqRes } = require('./handlers/handleReqRes');
require('dotenv').config();

// app object
const app = {};

// port define
const port = process.env.PORT || 5000;

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(port, () => {
        console.log(`Server is running at: http://localhost:${port}`);
    });
};

// handle response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
