const passport = require('passport'); // Importa el módulo passport
const LocalStrategy = require('passport-local').Strategy; // Importa el módulo passport-local
const request = require('request'); // Importa el módulo request


const User = require('../models/user'); // Importa el modelo User

passport.serializeUser((user, done) => { // Serializa el usuario
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => { // Deserializa el usuario
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({ // Configura la estrategia local-signup
    name: 'name',
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => { // Función que se ejecuta cuando se realiza una petición de registro

    const user = await User.findOne({'email': email}); // Busca un usuario con el mismo correo electrónico
    
    if(user){ // Si el usuario existe, se envía un mensaje de error
        return done(null, false, req.flash('signupMessage', 'El correo electrónico ya esta registrado.'));
    } else {
        const newUser = new User(); // Si el usuario no existe, se crea uno nuevo
        newUser.name = req.body.name;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
}));

passport.use('local-login', new LocalStrategy({ // Configura la estrategia local-login
    usernameField: 'email',
    passwordField: 'password',
    captchaField: 'g-recaptcha-response', // Nombre del campo que contiene la respuesta del usuario al captcha
    passReqToCallback: true
}, async (req, email, password, done) => { // Función que se ejecuta cuando se realiza una petición de inicio de sesión

    const user = await User.findOne({email: email}); // Busca un usuario con el mismo correo electrónico
    if(!user){ // Si el usuario no existe, se envía un mensaje de error
        return done(null, false, req.flash('loginMessage', 'Usuario o contraseña incorrectas'));
    }
    if(!user.comparePassword(password)){ // Si la contraseña no coincide, se envía un mensaje de error
        return done(null, false, req.flash('loginMessage', 'Usuario o contraseña incorrectas'));
    }
    const userCaptchaResponse = req.body['g-recaptcha-response']; // Obtiene la respuesta del usuario al captcha
    if (!userCaptchaResponse) { // Si el usuario no responde el captcha, se envía un mensaje de error
        return done(null, false, req.flash('loginMessage', 'Por favor, complete el captcha.'));
    }
    
    done(null, user); // Si el usuario existe y la contraseña coincide, se inicia sesión
    
    // Realiza una solicitud HTTP a la API de verificación del captcha de Google
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + '6LeFk-AkAAAAAEsL0ueaotzVhz6SasCVKPX5LcoO' + '&response=' + userCaptchaResponse + '&remoteip=' + req.connection.remoteAddress;
    
    request(verificationUrl, function (error, response, body) { // Función que se ejecuta cuando se obtiene la respuesta de la API
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) { // Si el captcha no pudo ser verificado, se envía un mensaje de error
            return done(null, false, req.flash('loginMessage', 'El captcha no pudo ser verificado.'));
        }});
}));
