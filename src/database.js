//para conectarnos a la BD
const mongoose = require('mongoose');

//conexion
mongoose.connect('mongodb://localhost:27017/TiendaAlem')
.then(db=> console.log("Conecte bien c:"));


/*
//que se conecnte al servicio mongo que es donde esta la mongodb en docker
mongoose.connect('mongodb://mongo/TiendaAlem')
.then(db=> console.log("Conecte bien c:"))
*/



