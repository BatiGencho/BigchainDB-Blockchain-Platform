// Babel ES6/JSX Compiler
require('babel-register');

const express = require('express');

const envConfig = require('./config/environment');
const expressConfig = require('./config/express');

module.exports = () => {
    let app = express();

    // Order matters!.

    // Setup local MongoDB connection
    //require('./config/database')(envConfig);

    // Initialize passport (some login mechanism)
    //require('./config/passport')();

    // Attach middleares
    expressConfig.attachMiddleWares(app);

    // Import server-routes.
    require('./config/server-routes')(app);

    // Server React-router. This should be after server routes, to have higher priority.
    // expressConfig.serveReactRoutes(app);

    app.listen(app.get('port'), () => console.log(`Express listening on ${app.get('port')}`));
};