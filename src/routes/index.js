const express = require('express');
const router = express.Router();
const passport = require('passport');
const Reservation = require('../models/reservations');

/*---------------------------- FUNCIONES ---------------------------------- */

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    return next();
    }
    res.redirect('/login');
}

function onlyGuest(req, res, next) {
    if (req.user.usertype === 'Huésped') {
    return next();
    }
    res.redirect('/');
}

/* ----------------------------------------------------------------------- */
/* ------------------------------- RAÍZ ---------------------------------- */

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.get('/signup2', (req, res, next) => {
    res.render('signup2');
});

router.get('/habitaciones', (req, res, next) => {
  res.render('habitaciones');
});

/* ----------------------------------------------------------------------- */
/* ---------------------------- HUÉSPED ---------------------------------- */

router.get('/reservaciones', isAuthenticated, onlyGuest, (req, res, next) => {
    const userEmail = req.user.email;
    Reservation.find({ email: userEmail })
    .then((reservaciones) => {
        res.render('reservaciones', { reservaciones });
    })
    .catch((error) => {
        res.render('error');
    });
});

router.post('/reservaciones/search', isAuthenticated, async (req, res, next) => {
    const { search } = req.body;
    const query = {
    email: req.user.email,
    $or: [
        { habitacion: { $regex: search.toString(), $options: 'i' } },
        { fecha_inicio: { $regex: search.toString(), $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
    ],
    };
    try {
    const reservaciones = await Reservation.find(query).lean().exec();
    res.render('reservaciones', { reservaciones });
    } catch (error) {
    res.render('error');
    }
});

router.get('/reservar', isAuthenticated, (req, res, next) => {
    res.render('reservar');
});

router.post('/reservar', (req, res) => {
    const {
    checkInDate,
    checkOutDate,
    selectRoom,
    noPersons,
    fullName,
    email,
    tel,
    } = req.body;

    if (
    !checkInDate ||
    !checkOutDate ||
    !selectRoom ||
    !noPersons ||
    !fullName ||
    !email ||
    !tel
    ) {
    req.flash('error', 'Todos los campos son requeridos');
    return res.redirect('/reservar');
    }

    const myReservation = new Reservation({
    fecha_inicio: checkInDate,
    fecha_fin: checkOutDate,
    habitacion: selectRoom,
    personas: noPersons,
    huesped: fullName,
    email: email,
    tel: tel,
    status: 'Pendiente',
    });

    myReservation.save();
    res.redirect('/reservaciones');
});

router.get('/disponibilidad', (req, res, next) => {
    res.render('disponibilidad');
});

router.post(
    '/signup',
    passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true,
    })
);

router.post(
    '/signup2',
    passport.authenticate('local-signup2', {
    successRedirect: '/profile',
    failureRedirect: '/signup2',
    passReqToCallback: true,
    })
);

router.post(
    '/login',
    passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    passReqToCallback: true,
    })
);

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

router.get('/logout', (req, res, next) => {
    req.logout(() => {
    res.redirect('/');
    });
});

router.get(
    '/cancelReservation/:id',
    isAuthenticated,
    onlyGuest,
    async (req, res, next) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/reservaciones');
    } catch (error) {
        next(error);
    }
    }
);

router.get('/editReservation/:id', isAuthenticated, onlyGuest, async (req, res, next) => {
    try {
        const reservacion = await Reservation.findById(req.params.id);
        res.render('updateReservacion', { reservacion });
    } catch (error) {
        next(error);
    }
});

router.post('/updateReservacion', isAuthenticated, onlyGuest, async (req, res, next) => {
    await Reservation.findByIdAndUpdate(req.body.id, {
        fecha_inicio: req.body.checkInDate,
        fecha_fin: req.body.checkOutDate,
        habitacion: req.body.selectRoom,
        personas: req.body.noPersons,
        huesped: req.body.fullName,
        email: req.body.email,
        tel: req.body.tel,
    })
    .then(() => {
        res.redirect('/reservaciones')
    })
    .catch((error) => {
        next(error);
    });
});

/* ----------------------------------------------------------------------- */
/* -------------------------- RECEPCIONISTA ------------------------------ */



module.exports = router;