const mongoose = require('mongoose');
const Schema = mongoose.Schema;//me deja definir como mostrarblos datos

const ClienteSchema = new Schema({  //creamos un esquema interno
    cedula: String,
    nombre: String,
    direccion: String,
    telefono:String,
    correo: String
});

module.exports = mongoose.model('cliente', ClienteSchema); //lo exportamos para utilizarlo en otros modulos
