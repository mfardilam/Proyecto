const mongoose = require('mongoose');
//Para cifrar pass
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

//Modelo de datos
const userSchema = new Schema({
    nombreU: String,
    apellidosU: String,
    cedulaU: Number,        
    emailU: String,
    username: String,
    password: String
});

//Metodo para cifrar la password
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//Comparar contraseña que ingresa con la BD
userSchema.methods.validarPass = function (password) {
    return bcrypt.compareSync(password, this.password);
}

//cree una coleccion llamada usuarios y guarde ahí el modelo de datos
module.exports = mongoose.model('usuarios',userSchema);
