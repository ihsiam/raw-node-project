// dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// app object
const app = {};

// initialize server and worker
app.init = () => {
    // server init
    server.init();

    // worker init
    worker.init();
};

// run the application
app.init();
