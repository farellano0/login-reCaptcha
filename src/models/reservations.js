const mongoose = require('mongoose'); // Importamos la librería de mongoose
const { Schema } = mongoose; // Extraemos el Schema de mongoose

const reservationSchema = new Schema({
    fecha_inicio: String,
    fecha_fin: String,
    habitacion: String,
    personas: String,
    huesped: String,
    email: String,
    tel: String,
    status: String,
});

module.exports = mongoose.model('reservations', reservationSchema); // Exportamos el modelo