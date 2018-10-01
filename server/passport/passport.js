const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const { User } = require('../db/models/models');
const { compare2hash } = require('../utils/password');

const ExtractJWT = passportJWT.ExtractJwt;
const StrategyJWT = passportJWT.Strategy;

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
}));


passport.use(new StrategyJWT({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'This is secret' 
}, function (jwtPayload, done) {
    User.findById(jwtPayload.id)
        .then(user => {
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        })
        .catch(err => done(err));
}
));

module.exports = passport;