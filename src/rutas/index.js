//Almacena las rutas principales, como mi controller
const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const csvModelo = require('../models/csv');
const multer = require('multer');
const csv = require('csvtojson');
const path = require('path');

//Ruta inicial 
router.get('/', (req,res,next) => {
    res.render('index');
});

//Registrarse
router.get('/singup', (req, res, next) => {
    res.render('registrar');
});

//Para escuchar y recibir los datos que ingresa el usuario al registrarse en la ruta de arriba
router.post('/singup', passport.authenticate('local-singup',{
    successRedirect: '/inicio', 
    failureRedirect: '/singup',
    passReqToCallback: true
}));

//Ingresar
router.get('/singin', (req, res, next) => {
    res.render('ingresar');

});

//Escucha datos, para validar
router.post('/singin', passport.authenticate('local-singin', {
    successRedirect: "/inicio",
    failureRedirect: "/singin",
    passReqToCallback: true
}));

//salir
router.get('/logout',(req, res, next)=>{
    req.logout();
    res.render('index');
})


//Página de inicio luego de autenticarse
router.get('/inicio', isAuthenticated, (req, res, next) => {
    res.render('inicio');
});

// para que no pueda ir a inicio sin logear
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect('/singin');
};

router.use((req, res, next) => {
    isAuthenticated(req, res, next);
   // next();
});


//Para el csv

/*
router.get('/productos', (req, res, next) =>{
    /*csvModelo.find((err, data)=>{
        if(err){
            console.log(err);
        }else{
            if(data!=''){
                res.render('productos',{data:data});
            }else{
                res.render('productos',{data:''});
            }
        }
    });
    res.render('productos');
});*/


//express.use(express.json());
//express.use(express.urlencoded({extended: true}));

//pasar csv a jsonArray
/*
router.post('/productos', uploads.single('csv'),(req,res)=>{  
   csv()
   .fromFile(req.file.path)
   .then((jsonObj)=>{
       console.log(jsonObj);
       for(var x=0;x<jsonObj;x++){
            temp = parseFloat(jsonObj[x].codigo_producto)
            jsonObj[x].codigo_producto = temp;
            temp = parseFloat(jsonObj[x].nitproveedor)
            jsonObj[x].nitproveedor = temp;
            temp = parseFloat(jsonObj[x].precio_compra)
            jsonObj[x].precio_compra = temp;
            temp = parseFloat(jsonObj[x].ivacompra)
            jsonObj[x].ivacompra = temp;
            temp = parseFloat(jsonObj[x].precio_venta)
            jsonObj[x].precio_venta = temp;
        }
        csvModelo.insertMany(jsonObj,(err,data)=>{
               if(err){
                   console.log(err);
               }else{
                   res.redirect('/');
               }
        });
      });
   });*/

   /*
router.post('/productos', uploads.single('csv'), (req, res) => {
    console.log('subi el csv');
    return res.send(req.file);

});

const uploads = multer({storage: storage});

let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,"Proyecto/src/public/uploads");
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    }
});
*/

const upload = multer({
    dest: '../public/uploads'
})

router.get('/productos', (req, res, next) =>{
    res.render('productos');
    console.log(__dirname);
    res.sendFile('src/views/productos.ejs', { root: '.' });
});

router.post('/productos', upload.single('csvProductos'), (req, res, next) =>{
    res.send("Csv subido");
});

//////////////////////////////////////USUARIOS 

const User = require('../models/usuarios');

//Listar
router.get('/usuarios', async (req, res) => {
    try {
        const arrayUsuariosDB = await User.find();
        console.log(arrayUsuariosDB)//Vemos lo que trae de la BD
        res.render("usuarios", {
            arrayUsuarios: arrayUsuariosDB
        })
    } catch (error) {
        console.log(error)
    }
}); 


//Vista de Crear nuevo usuario
router.get('/crearUsuario', (req, res) => {
    res.render('crearUsuario');
});
 
//Nuevo usuario
router.post('/usuariosP', passport.authenticate('local-singup', {
    successRedirect: "/usuarios",
    failureRedirect: "/usuarios",
    passReqToCallback: true
}));

/* //Editar usuario
router.get('/usuarios/:id', async(req, res) => {//capture el id--->ruta/id
    const id = req.params.id 
    try{
        const usuarioBD = await User.findOne({_id: id});
        console.log(usuarioBD)
        res.render('detalleUsuario',{
            usuario: usuarioBD,
            error:false
        })
    }catch(error){
        res.render('detalleUsuario',{
        error: true,
        mensaje: "No se encuentra el id escogido"
    })
    };
});

router.put('/usuarios/:id', async(req, res)=>{
    const id = req.params.id;
    const body = req.body
    try{
        const usuarioBD = await User.findByIdAndUpdate(id, body, {useFindAndModify: false});
        console.log(usuarioBD);
        res.json({
            estado: true,
            mensaje: 'Editado'
        })
    }catch (error){
        console.log(error);
        res.json({
            estado: false,
            mensaje: 'No se pudo editar :C'
        })
    }
});



//Eliminar
router.delete('/usuarios/:id', async (req, res)=>{
    const id = req.params.id;
    try{
        const usuarioDB = await User.findByIdAndDelete({_id: id});
        if (usuarioDB) {
            res.json({
                estado: true,
                mensaje: 'Eliminado c:'
            })
        } else {
            res.json({
                estado: false,
                mensaje: 'No se pudo eliminar :C'
            })
        }
    }catch (error){
        console.log(error);
    }
}); */


//para editar 

router.get('/usuarios/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    const usuario = await User.findById(id); // buscame el id
    res.render('detalleUsuario', {
        usuario
    });

});


router.post('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, req.body)
    res.redirect('/usuarios');

});

//para eliminar 

router.get('/eliminarUser/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    await User.remove({ _id: id }); //eliminame el id
    console.log(typeof req.next);
    res.redirect('/usuarios');
});


///////////////CLIENTES
//Para usar las rutas en otros archivos la exportamos

const Cliente = require('../models/cliente');//me traigo el moedlo cliente y lo almaceno

router.get('/clientes', async (req, res) => { //cuando me pidan una solicitud muestrame el mensaje
    const clientes = await Cliente.find();//me traes los datos desde la bd 
    console.log(clientes);  //muestrame lo lamacenado en clientes
    res.render('clientes', {
        clientes //traeme el arreglo 
    }); //traeme el index.ejs
});

router.get('/agregarcliente', (req, res) => {
    res.render('crearCliente');
});

router.post('/agregarcliente', async (req, res) => { //recibeme los datos del formulario
    //console.log(new Cliente(req.body)); //aqui me almacena en mongodb los datos de mi tabla cliente 
    //console.log(req.body);
    const cliente = new Cliente(req.body);///aqui me almacena en mongodb los datos de mi tabla cliente 
    await cliente.save(); //guardame el objeto
    res.redirect('/clientes');//llevame a la raiz nuevamente
    //async y await  me permite no utilizar promesas para los mensajes de error ni acptacion
});


//para editar 

router.get('/editcliente/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    const cliente = await Cliente.findById(id); // buscame el id
    res.render('editcliente', {
        cliente
    });

});


router.post('/editcliente/:id', async (req, res) => {
    const { id } = req.params;
    await Cliente.findByIdAndUpdate(id, req.body)
    res.redirect('/clientes');

});

//para eliminar 

router.get('/eliminarcliente/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    await Cliente.remove({ _id: id }); //eliminame el id
    console.log(typeof req.next);
    res.redirect('/clientes');
});




module.exports = router;

