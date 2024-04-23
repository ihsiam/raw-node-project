// dependencies
const { tokenHandler, userHandler, homePageHandler } = require('../handlers/routerHandler');

// route object
const route = {
    '': homePageHandler,
    user: userHandler,
    token: tokenHandler,
};

// module export
module.exports = route;
