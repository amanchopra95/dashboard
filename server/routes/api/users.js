const route = require('express').Router();
const { User } = require('../../db/models/models');
const { pass2hash } = require('../../utils/password');
 
route.get('/', (req, res) => {
    User.findAll()
        .then((users) => {
            if (!users) res.send('No users');
            return res.json(users);
        });
});

route.post('/register', (req, res) => {
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

route.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) res.send('Not found');
            else res.json(user);
        });
});

route.get('/username/:username', (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    })
    .then((user) => {
        if (!user) res.send('User does not exist')
        else res.json(user);
    });
});

module.exports = route;