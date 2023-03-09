const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const request = require('request');


const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    name: 'name',
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await User.findOne({'email': email});
    
    if(user){
        return done(null, false, req.flash('signupMessage', 'El correo electrónico ya esta registrado.'));
    } else {
        const newUser = new User();
        newUser.name = req.body.name;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    captchaField: 'g-recaptcha-response', // Nombre del campo que contiene la respuesta del usuario al captcha
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, req.flash('loginMessage', 'Usuario o contraseña incorrectas'));
    }
    if(!user.comparePassword(password)){
        return done(null, false, req.flash('loginMessage', 'Usuario o contraseña incorrectas'));
    }
    const userCaptchaResponse = req.body['g-recaptcha-response'];
    if (!userCaptchaResponse) {
        return done(null, false, req.flash('loginMessage', 'Por favor, complete el captcha.'));
    }
    
    done(null, user);
    
    // Realiza una solicitud HTTP a la API de verificación del captcha de Google
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + '6LeFk-AkAAAAAEsL0ueaotzVhz6SasCVKPX5LcoO' + '&response=' + userCaptchaResponse + '&remoteip=' + req.connection.remoteAddress;
    
    request(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return done(null, false, req.flash('loginMessage', 'El captcha no pudo ser verificado.'));
        }});
}));