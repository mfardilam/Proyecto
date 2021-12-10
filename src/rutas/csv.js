const mongodb = require("mongodb").MongoClient;
const express = require('express');
const router = express.Router();

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
const Productos = require('../models/csv');


router.get('/', (req, res) => {
    res.render('productos');
    //console.log(__dirname);
    res.sendFile('productos.ejs', { root: 'src/views' });
    //res.sendFile(path.resolve('../views/productos.ejs'));
});


var archivo;
let url = "mongodb://localhost:27017/";

router.post('/', upload.single('csvProductos'), (req, res, next) => {
    const file = req.file
    //si no hay archivo 
    if (!file) {
        const error = new Error('Por favor suba un archivo')
        error.httpStatusCode = 400
        res.render('subaArchivo')
        return next(error)
    } else {
        console.log(file);
        archivo = req.file.path
        //res.render('/mostrarProductos');
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
                            .db("TiendaAlem")
                            .collection("productos")
                            .insertMany(csvData, (err, res) => {
                                if (err) throw err;

                                console.log(`Inserte: ${res.insertedCount} filas`);
                                client.close();
                            });
                    }
                );
            });
        res.redirect('productos/mostrar');    
    }
    
});

//Listar productos 
router.get('/mostrar', async (req, res) => {
    try {
        const arrayProductosDB = await Productos.find();
        //console.log(arrayproductosDB)
        res.render("mostrarProductos", {
            arrayProducto: arrayProductosDB
        })

    } catch (error) {
        console.log(error)
    }
    res.render("mostrarProductos")
});


module.exports = router;