const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/', (req, res, next) => {
    res.render('login');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup' ,{
    successRedirect: '/',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.post('/login', passport.authenticate('local-login' ,{
    successRedirect: '/profile',
    failureRedirect: '/',
    passReqToCallback: true
}));

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

router.get('/logout', (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    });
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}


module.exports = router;