const { compare2hash } = require('../utils/password');
const { User } = require('../db/models/models');
const jwt = require('jsonwebtoken');

function authenticate(username, password) {
    User.findOne({
        where: {
            username: username
        }
    })
        .then((user) => {
            if (!user) {
                return done(null, false);
            } else {
                compare2hash(password, user.password)
                    .then((match) => {
                        if (!match) return done(null, user);
                        else return done(null, user);
                    })
                    .catch(err => console.log(err));
            }
        })
}

module.exports = {
    authenticate
}