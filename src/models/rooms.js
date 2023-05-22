const mongoose = require('mongoose'); // Importamos la librería de mongoose
const { Schema } = mongoose; // Extraemos el Schema de mongoose

const roomsSchema = new Schema({ // Creamos el esquema de la base de datos
    idRoom: String,
    type: String,
    state: String,
    capacity: Number,
    description: String
});

module.exports = mongoose.model('rooms', roomsSchema); // Exportamos el modelo