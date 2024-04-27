// dependencies
const {
    tokenHandler,
    userHandler,
    homePageHandler,
    checkHandler,
} = require('../handlers/routerHandler');

// route object
const route = {
    '': homePageHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

// module export
module.exports = route;
