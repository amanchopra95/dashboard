const route = require('express').Router();

route.get('/', (req, res) => {
    req.logout();
    res.json({loggedOut: true});
})

module.exports = route;