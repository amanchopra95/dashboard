const route = require('express').Router();
const passport = require('passport');

route.post('/',
    passport.authenticate(
        'local',
        {failureRedirect: '/'}
    ),
    (req, res) => {
        res.json(req.user);
    }
);

module.exports = route;