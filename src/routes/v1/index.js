const express = require('express');
const trackRoute = require('./track.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/track',
        route: trackRoute
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

if (config.env === 'development') {
    defaultRoutes.forEach((route) => {
        router.use(route.path, route.route);
    }); 
}

module.exports = router;