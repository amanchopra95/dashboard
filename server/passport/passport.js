const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../db/models/models');
const { compare2hash } = require('../utils/password');

passport.serializeUser((user, done) => {
    if (!user.id) {
        return done(null, new Error('User has no id'))
    }
    return done(null, user.id)
});

passport.deserializeUser((userId, done) => {
    User.findOne({
        where: {
            id: userId
        }
    })
    .then((user) => {
        if (!user) return done(null, new Error('User does not exist'));
        return done(null, user);
    });
});

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({
        where: {
            username: username
        }
    })
    .then((user) => {
        if (!user) {
            console.log("This not done. User is not there")
            return done(null, false);
        } else {
            compare2hash(password, user.password)
                .then((match) => {
                    if (!match) return done(null, user);
                    else return done(null, user);
                })
        }
    })
}));

module.exports = passport;