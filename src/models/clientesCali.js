const mongoose = require('mongoose');
//Para usar eBD diferente
const caliBD = mongoose.connection.useDb('TiendaAlemCali');

const Schema = mongoose.Schema;//me deja definir como mostrarblos datos

const ClientecaliSchema = new Schema({  //creamos un esquema interno
    cedula: String,
    nombre: String,
    direccion: String,
    telefono:String,
    correo: String
});

//Crea coleccion en BD indicada
const ClienteCali = caliBD.model('clientes', ClientecaliSchema);
module.exports = ClienteCali;