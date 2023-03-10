const mongoose = require('mongoose'); // Importa el módulo mongoose
const {mongodb} = require('./keys'); // Importa el objeto mongodb del archivo keys.js

mongoose.connect(mongodb.URI, {useNewURLParser: true}) // Conecta a la base de datos de MongoDB
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err))