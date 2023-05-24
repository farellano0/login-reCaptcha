const express = require('express'); // Importa el módulo express
const router = express.Router(); // Importa el módulo router de express
const Reservation = require('../models/reservations'); // Inyectamos el modelo de reserva


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

router.get('/habitaciones', (req, res, next) => { // Ruta de habitaciones
    res.render('habitaciones');
});

router.get('/reservaciones', isAuthenticated, (req, res, next) => { // Ruta de habitaciones
    // Obtener el EMAIL del usuario autenticado
    const userEmail = req.user.email;

    // Obtener las reservaciones del usuario actual desde la base de datos
    Reservation.find({ email: userEmail })
    .then((reservaciones) => {
      // Renderizar la vista EJS y pasar los datos de las reservaciones
        res.render('reservaciones', { reservaciones });
    })
    .catch((error) => {
      // Manejar el error si ocurre
        console.log(error);
        res.render('error'); // Renderizar una vista de error, por ejemplo
    });
});

router.post('/reservaciones/search', isAuthenticated, async (req, res, next) => {
    const { search } = req.body;
    const query = { email: req.user.email,
        $or: [
        { habitacion: { $regex: search.toString(), $options: 'i' } }
        ]
    };
    try {
        const reservaciones = await Reservation.find(query).lean().exec();
        res.render('reservaciones', { reservaciones });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
});

router.get('/reservar', isAuthenticated, (req, res, next) => {
    res.render('reservar');
});


router.post('/reservar', function (req, res){
    // Obtener los datos enviados en la solicitud
    const {
        checkInDate,
        checkOutDate,
        selectRoom,
        noPersons,
        fullName,
        email,
        tel
    } = req.body;

    // Verificar si algún dato requerido está faltando
    if (!checkInDate || !checkOutDate || !selectRoom || !noPersons || !fullName || !email || !tel) {
        // Redireccionar al formulario de reserva con un mensaje de error
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect('/reservar');
    }

    // Crear la instancia de la reserva
    const myReservation = new Reservation({
        fecha_inicio: checkInDate,
        fecha_fin: checkOutDate,
        habitacion: selectRoom,
        personas: noPersons,
        huesped: fullName,
        email: email,
        tel: tel,
        status: "Pendiente"
    });

    // Guardar la reserva en la base de datos
    myReservation.save();
    res.redirect('/reservaciones')
});

router.get('/disponibilidad', (req, res, next) => { // Ruta de habitaciones
    res.render('disponibilidad');
});

router.post('/signup', passport.authenticate('local-signup' ,{ // Ruta de registro que utiliza la estrategia local-signup
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.post('/signup2', passport.authenticate('local-signup2' ,{ // Ruta de registro que utiliza la estrategia local-signup
    successRedirect: '/profile',
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

    res.redirect('/login');
}


module.exports = router; // Exporta el módulo router