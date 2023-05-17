const express = require('express'); // Importa el módulo express
const router = express.Router(); // Importa el módulo router de express

const passport = require('passport'); // Importa el módulo passport

router.get('/', (req, res, next) => { // Ruta raíz
    res.render('index');
});

router.get('/login', (req, res, next) => { // Ruta raíz
    res.render('login');
});

router.get('/signup', (req, res, next) => { // Ruta de registro
    res.render('signup');
});

router.get('/signup2', (req, res, next) => { // Ruta de registro de recepcionista
    res.render('signup2');
});

router.get('/habitaciones', (req, res, next) => {
    res.render('habitaciones');
})

router.post('/signup', passport.authenticate('local-signup' ,{ // Ruta de registro que utiliza la estrategia local-signup
    successRedirect: '/login',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.post('/signup2', passport.authenticate('local-signup2' ,{ // Ruta de registro que utiliza la estrategia local-signup
    successRedirect: '/login',
    failureRedirect: '/signup2',
    passReqToCallback: true
}));

router.post('/login', passport.authenticate('local-login' ,{ // Ruta de inicio de sesión que utiliza la estrategia local-login
    successRedirect: '/profile',
    failureRedirect: '/login',
    passReqToCallback: true
}));

router.get('/profile', isAuthenticated, (req, res, next) => { // Ruta de perfil
    res.render('profile');
});

router.get('/logout', (req, res, next) => { // Ruta de cierre de sesión
    req.logout(() => {
        res.redirect('/');
    });
});

function isAuthenticated(req, res, next) { // Función que verifica si el usuario está autenticado
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}


module.exports = router; // Exporta el módulo router