const express = require('express');
const path = require('path')
const session = require('express-session');
const passport = require('./passport/passport');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(session({
    secret: 'This is some secret which is not to be revealed!',
    saveUninitialized: true,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', express.static(path.join(__dirname, '../client/public/')));
app.use('/client', require('./routes/api/clients'));
app.use('/phone', require('./routes/api/phone'));
app.use('/login', require('./routes/login'));
app.use('/user', require('./routes/api/users'));
app.use('/logout', require('./routes/logout'));

app.listen(process.env.PORT || 5000, () => {
    const port = process.env.PORT || 5000;
    console.log("Server is on Port 5000" + port);
});