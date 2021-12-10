const mongoose = require('mongoose');
//Para usar eBD diferente
const caliBD = mongoose.connection.useDb('TiendaAlemCali');

const Schema = mongoose.Schema;//me deja definir como mostrarblos datos

//Modelo de datos
const proveedoresSchema = new Schema({
    nit: Number,
    nombreP: String,
    direccionP: String,
    telefonoP: Number,
    ciudadP: String 
});

//Crea coleccion en BD indicada
const ProveedoresCali = caliBD.model('Proveedores', proveedoresSchema);
module.exports = ProveedoresCali;