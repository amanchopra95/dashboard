const route = require('express').Router();
const { compare2hash } = require('../utils/password');
const models = require('../db/models');
const jwt = require('jsonwebtoken');

const User = models.user;

route.post('/',(req, res) => {
    let username = req.body.username;
    User.findOne({
        where: {
            username: username
        }
    })
        .then((user) => {
            if (!user) {
                res.status(401).json({message: "User not found"});
            } else {
                compare2hash(req.body.password, user.password)
                    .then((match) => {
                        if (!match) res.status(401).json({message: "User or password does not match"});
                        user = user.toJSON();
                        tokenUser = {
                            username: user.username,
                            role: user.role,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            id: user.id
                        };
                        const token = jwt.sign(tokenUser, process.env.JWT_SECRET);
                        res.json({ tokenUser, token });
                    })
                    .catch(err => console.log(err));
            }
        })
    }
);

module.exports = route;