const express = require('express');
const router = express.Router();


//////////////////////CLIENTES
//Aca llamaremos el modelo de datos
const Cliente = require('../models/clientesCali');
router.get('/clientes', async (req, res) => { 
    const clientesCali = await Cliente.find();//me traes los datos desde la bd 
    console.log(clientesCali);  //muestrame lo almacenado en clientes
    res.render('clientesCali', {
        clientesCali //traeme el arreglo 
    }); 
});

router.get('/agregarcliente', (req, res) => {
    res.render('crearClienteCali');
});

router.post('/agregarcliente', async (req, res) => { //recibeme los datos del formulario
    //console.log(new Cliente(req.body)); //aqui me almacena en mongodb los datos de mi tabla cliente 
    //console.log(req.body);
    const cliente = new Cliente(req.body);///aqui me almacena en mongodb los datos de mi tabla cliente 
    await cliente.save(); //guardame el objeto
    res.redirect('/cali/clientes');//llevame a la raiz nuevamente
    //async y await  me permite no utilizar promesas para los mensajes de error ni acptacion
});


//para editar 

router.get('/editcliente/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    const clientesCali = await Cliente.findById(id); // buscame el id
    res.render('editclienteCali', {
        clientesCali
    });

});


router.post('/editcliente/:id', async (req, res) => {
    const { id } = req.params;
    await Cliente.findByIdAndUpdate(id, req.body)
    res.redirect('/cali/clientes');

});

//para eliminar 

router.get('/eliminarcliente/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    await Cliente.remove({ _id: id }); //eliminame el id
    console.log(typeof req.next);
    res.redirect('/cali/clientes');
});


////////////////////////////PRODUCTOS
const mongodb = require("mongodb").MongoClient;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });
const csvtojson = require("csvtojson");
const Productos = require('../models/csvCali');

router.get('/productos', (req, res) => {
    res.render('productosCali');
    //console.log(__dirname);
    res.sendFile('productosCali.ejs', { root: 'src/views' });
    //res.sendFile(path.resolve('../views/productos.ejs'));
});


var archivo;
let url = "mongodb://localhost:27017/";

router.post('/productos', upload.single('csvProductosCali'), (req, res, next) => {
    const file = req.file
    //si no hay archivo 
    if (!file) {
        const error = new Error('Por favor suba un archivo')
        error.httpStatusCode = 400
        res.render("subaArchivoCali")
        return next(error)
    } else {
        console.log(file);
        archivo = req.file.path
        csvtojson()
            .fromFile(archivo)
            .then(csvData => {
                console.log(csvData);

                mongodb.connect(
                    url,
                    { useNewUrlParser: true, useUnifiedTopology: true },
                    (err, client) => {
                        if (err) throw err;

                        client
                            .db("TiendaAlemCali")
                            .collection("productos")
                            .insertMany(csvData, (err, res) => {
                                if (err) throw err;

                                console.log(`Inserte: ${res.insertedCount} filas`);
                                client.close();
                            });
                    }
                );
            });
        res.redirect('/cali/productos/mostrar');    
    }
    
});

//Listar productos 
router.get('/productos/mostrar', async (req, res) => {
    try {
        const arrayProductosDB = await Productos.find();
        //console.log(arrayproductosDB)
        res.render("mostrarProductosCali", {
            arrayProducto: arrayProductosDB
        })

    } catch (error) {
        console.log(error)
    }
    res.render("mostrarProductosCali")
});


///////////////////////////PROVEEDORES

const Proveedor = require('../models/proveedoresCali');
router.get('/proveedores', async (req, res) => {
    try {
        const arrayProveedoresDB = await Proveedor.find();
        console.log(arrayProveedoresDB)
        res.render("proveedoresCali", {
            arrayProveedores: arrayProveedoresDB
        })

    } catch (error) {
        console.log(error)
    }

});



//Aqui vamos a llamar la vista de nuevos usuarios
router.get('/crearProveedores', (req, res) => {
    res.render('crearProvCali');
});

//Aqui vamos a llamar la ruta de los datos y conectar con bd
router.post('/proveedores', async (req, res) => {
    const body = req.body;
    
    try{
        const proveedorDB = new Proveedor(body);
        await proveedorDB.save();
        console.log(body);

        res.redirect('/cali/proveedores');
    }catch(error){
        console.log(error);
    }
});

//Editar
router.get('/proveedores/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    const proveedor = await Proveedor.findById(id); // buscame el id
    res.render('detalleProvCali', {
        proveedor
    });

});

router.post('/proveedores/:id', async (req, res) => {
    const { id } = req.params;
    await Proveedor.findByIdAndUpdate(id, req.body)
    res.redirect('/cali/proveedores');

});

//para eliminar 

router.get('/eliminarProv/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    await Proveedor.remove({ _id: id }); //eliminame el id
    console.log(typeof req.next);
    res.redirect('/cali/proveedores');
});

module.exports = router;