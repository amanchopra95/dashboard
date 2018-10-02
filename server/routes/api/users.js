const route = require('express').Router();
const { User } = require('../../db/models/models');
const { pass2hash } = require('../../utils/password');
const passport = require('../../passport/passport');
 
route.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    User.findAndCountAll({
        order: [[req.query._sort, req.query._order]],
        offset: +req.query._start,
        limit: +req.query._end,
    })
        .then((users) => {
            if (!users) res.send("No Users");
            res.setHeader('X-Total-Count', users.count);
            res.header('Access-Control-Expose-Headers', 'X-Total-Count');
            res.json(users.rows);
        });
});

route.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    pass2hash(req.body.password)
    .then((hash) => {
        User.create({
            username: req.body.username,
            password: hash,
            role: req.body.role,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        .then((created) => {
            if (!created) res.send("Not created");
            res.json(created);
        });
    });
});

route.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) res.send('Not found');
            res.json(user);
        });
});

route.put('/:id', passport.authenticate('jwt', { session: false }), (req,res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) res.send("No such user");
            pass2hash(req.body.password)
                .then((hash) => {
                    user.update({
                        username: req.body.username,
                        password: hash,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    })
                    .then((value) => {
                        res.json(value);
                    })
                })
        })
});

route.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.destroy({
        where: req.params.id
    })
    .then((value) => res.json(value));
});



/* route.get('/username/:username', (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    })
    .then((user) => {
        if (!user) res.send('User does not exist')
        else res.json(user);
    });
}); */

module.exports = route;