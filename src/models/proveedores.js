//Aca crearemos el modelo de datos del cliente
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Aqui creamos el esquema de datos del cliente
const clienteSchema = new Schema({
        nit: Number,
        nombreP: String,
        direccionP: String,
        telefonoP: Number,
        ciudadP: String 
});

//Llamado del Modelo

const Cliente = mongoose.model('Proveedores', clienteSchema);




module.exports = Cliente;