//para conectarnos a la BD
const mongoose = require('mongoose');

//conexion
mongoose.connect('mongodb://localhost:27017/TiendaAlem')
.then(db=> console.log("Conecte bien c:"));
