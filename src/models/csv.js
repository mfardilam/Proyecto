const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo de datos
const csvSchema = new Schema({
    codigo_producto: String,
    nombre_producto: String,
    nitproveedor: String,
    precio_compra: String,
    ivacompra: String,
    precio_venta: String,
});

//Exportamos para usarlo en otros modulos
const Productos = mongoose.model('productos',csvSchema);
module.exports = Productos;