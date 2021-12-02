const mongoose = require('mongoose');
const { Schema } = mongoose;

//Modelo de datos
const csvSchema = new Schema({
    codigo_producto: Number,
    nombre_producto: String,
    nitproveedor: Number,
    precio_compra: Number,
    ivacompra: Number,
    precio_venta: Number,
});

//cree una coleccion llamada productos y guarde ahí el modelo de datos
module.exports = mongoose.model('productos',csvSchema);