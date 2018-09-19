const bcrypt = require('bcrypt');
const saltRounds = 8;

module.exports = {
    pass2hash: (password) => bcrypt.hash(password, saltRounds),
    compare2hash: (password, hash) => bcrypt.compare(password, hash)
};