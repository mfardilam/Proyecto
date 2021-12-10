//Código del servidor
const express = require('express');
//motor de plantillas
const engine = require('ejs-mate');
//ruta en PC
const path = require('path');
//Para ver peticiones dle usuario en consola
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash'); //envia msj entre páginas
const multer = require('multer');
const csvModelo = require('./models/csv');
const csv = require('csvtojson');
const bodyParser = require('body-parser');


//Inicializaciones
const app = express();
require('./database');
require('./passport/local-auth');

//Configuración
app.set('views', path.join(__dirname, 'views'));//le indico donde estan mis archivos: src/views
app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('port', process.env.PORT|| 3000); //Utilice el puerto del sis. operativo, si no existe use el 3mil
app.set(express.static(__dirname + './public'));

////middlewares
app.use(morgan('dev'));//descripcion breve -> dev
//Vamos a decirle a express que reciba los datos del form, datos sencillos
app.use(express.urlencoded({extended: false}));
//Sesion que se puede pasar entre paginas
app.use(session({
    secret: 'misesionsecreta', //cada sesion se guarda de manera unica
    resave: false,//evita que se vuelva a guardar
    saveUninitialized: false //no se autoguarde
}));
app.use(flash());//usa sesion y envia msj antes de usar passport
app.use(passport.initialize());//inicialice passport
app.use(passport.session()); //para guardar datos serializables

//pasar mensaje
app.use((req, res, next) => {
    //Toma el msj si existe y lo guarda en singupMessage
    app.locals.singupMessage = req.flash('singupMessage');
    app.locals.singinMessage = req.flash('singinMessage');
    app.locals.user = req.user;
    next();//Para que continue una vez lo almacene
    
});

/////////////////////////

//Rutas
app.use('/', require('./rutas/index'));
app.use('/productos', require('./rutas/csv'));
app.use('/proveedores', require('./rutas/proveedores'));
app.use('/ventas', require('./rutas/ventas'));
// ruta para los assets
app.use('/public', express.static('public'))
app.use('/cali', require('./rutas/cali'));




//Empezando el servidor
app.listen(app.get('port'),()=>{
    console.log('Servidor en el puerto ',app.get('port'));
});