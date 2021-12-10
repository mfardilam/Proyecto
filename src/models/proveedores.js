//Aca crearemos el modelo de datos del cliente
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Aqui creamos el esquema de datos del cliente
const proveedoresSchema = new Schema({
        nit: Number,
        nombreP: String,
        direccionP: String,
        telefonoP: Number,
        ciudadP: String 
});

//Llamado del Modelo

const Proveedor = mongoose.model('Proveedores', proveedoresSchema);
module.exports = Proveedor;