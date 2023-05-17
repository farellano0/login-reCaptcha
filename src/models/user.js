const mongoose = require('mongoose'); // Importamos la librería de mongoose
const bcrypt = require('bcrypt-nodejs'); // Importamos la librería de bcrypt
const { Schema } = mongoose; // Extraemos el Schema de mongoose

const userSchema = new Schema({ // Creamos el esquema de la base de datos
    name: String,
    email: String,
    password: String,
    usertype: Number
});

userSchema.methods.encryptPassword = (password) => { // Creamos el método para encriptar la contraseña
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function (password) { // Creamos el método para comparar la contraseña
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('users', userSchema); // Exportamos el modelo