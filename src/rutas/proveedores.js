const express = require('express');
const router = express.Router();
//Aca llamaremos el modelo de datos
const Proveedor = require('../models/proveedores');
router.get('/', async (req, res) => {
    try {
        const arrayProveedoresDB = await Proveedor.find();
        console.log(arrayProveedoresDB)
        res.render("proveedores", {
            arrayProveedores: arrayProveedoresDB
        })

    } catch (error) {
        console.log(error)
    }

});



//Aqui vamos a llamar la vista de nuevos usuarios
router.get('/crear', (req, res) => {
    res.render('crearProv');
});

//Aqui vamos a llamar la ruta de los datos y conectar con bd
router.post('/', async (req, res) => {
    const body = req.body;
    
    try{
        const proveedorDB = new Proveedor(body);
        await proveedorDB.save();
        console.log(body);

        res.redirect('/proveedores');
    }catch(error){
        console.log(error);
    }
});

//Editar
router.get('/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    const proveedor = await Proveedor.findById(id); // buscame el id
    res.render('detalleProv', {
        proveedor
    });

});

router.post('/:id', async (req, res) => {
    const { id } = req.params;
    await Proveedor.findByIdAndUpdate(id, req.body)
    res.redirect('/proveedores');

});

//para eliminar 

router.get('/eliminarProv/:id', async (req, res) => { //recibeme los datos del formulario
    const { id } = req.params; //nos da los parametros que estamos recibiendo ene ste caso el id para borrar
    await Proveedor.remove({ _id: id }); //eliminame el id
    console.log(typeof req.next);
    res.redirect('/proveedores');
});


module.exports = router;