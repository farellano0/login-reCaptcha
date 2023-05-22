const mongoose = require('mongoose'); // Importamos la librería de mongoose
const { Schema } = mongoose; // Extraemos el Schema de mongoose

const reservationSchema = new Schema({
    fecha_inicio: Date,
    fecha_fin: Date,
    habitacion: String,
    personas: Number,
    huesped: String,
    email: String,
    tel: Number,
});

module.exports = mongoose.model('reservations', reservationSchema); // Exportamos el modelo