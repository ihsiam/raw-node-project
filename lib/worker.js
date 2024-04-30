// worker obj
const worker = {};

// check fucntion
worker.checks = () => {
    console.log('function running');
};

// check loop
worker.loop = () => {
    setInterval(() => {
        worker.checks();
    }, 1000 * 5);
};

// init
worker.init = () => {
    // exicute all the checks
    worker.checks();

    // loop for continuing checks
    worker.loop();
};

// module export
module.exports = worker;
