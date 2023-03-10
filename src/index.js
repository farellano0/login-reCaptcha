const express = require('express'); // Importa el módulo express que sirve para crear el servidor
const engine = require('ejs-mate'); // Importa el módulo ejs-mate que sirve para usar ejs como motor de plantillas
const path = require('path'); // Importa el módulo path que sirve para manejar rutas
const morgan = require('morgan'); // Importa el módulo morgan que sirve para ver las peticiones que se hacen al servidor
const passport = require('passport'); // Importa el módulo passport que sirve para autenticar usuarios
const session = require('express-session'); // Importa el módulo express-session que sirve para crear sesiones
const flash = require('connect-flash'); // Importa el módulo connect-flash que sirve para enviar mensajes entre vistas

// Initializations
const app = express(); // Crea una aplicación express
require('./database'); // Importa el archivo database.js
require('./passport/local-auth'); // Importa el archivo local-auth.js

// settings
app.set('views', path.join(__dirname, 'views')); // Establece la ruta de las vistas
app.engine('ejs', engine); // Establece ejs como motor de plantillas
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000); // Establece el puerto en el que se ejecutará el servidor

// middlewares son funciones que se ejecutan antes de que lleguen a las rutas
app.use(morgan('dev')); // Usa el módulo morgan para ver las peticiones que se hacen al servidor
app.use(express.urlencoded({extended: false})); // Usa el módulo express.urlencoded para entender los datos que llegan desde un formulario
app.use(session({ // Usa el módulo express-session para crear sesiones
    secret: 'mySecretSession',
    resave: true,
    saveUninitialized: false
}))
app.use(flash()); // Usa el módulo connect-flash para enviar mensajes entre vistas
app.use(passport.initialize()); // Usa el módulo passport para inicializar passport
app.use(passport.session());

app.use((req, res, next) => { 
    app.locals.signupMessage = req.flash('signupMessage'); // Usa el módulo connect-flash para enviar mensajes entre vistas
    app.locals.loginMessage = req.flash('loginMessage');
    app.locals.user = req.user; // trae la información del usuario que se autenticó
    next();
})


//routes
app.use('/', require('./routes/index'));

// starting the server
app.listen(app.get('port'), () => { // Inicia el servidor
    console.log('Server on port', app.get('port'));
});

