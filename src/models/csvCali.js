const mongoose = require('mongoose');
//Para usar eBD diferente
const caliBD = mongoose.connection.useDb('TiendaAlemCali');

const Schema = mongoose.Schema;//me deja definir como mostrarblos datos

//Modelo de datos
const csvCaliSchema = new Schema({
    codigo_producto: String,
    nombre_producto: String,
    nitproveedor: String,
    precio_compra: String,
    ivacompra: String,
    precio_venta: String,
});

//Crea coleccion en BD indicada
const ProductosCali = caliBD.model('Productos', csvCaliSchema);
module.exports = ProductosCali;