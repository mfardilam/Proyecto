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

//Botones y pantalla de crear////////////////
//Detallar el cliente para editar y borrar
/* router.get('/:id', async(req, res) => {//capture el id--->ruta/id
    const id = req.params.id 
    try{
        const proveedorDB = await Proveedor.findOne({_id: id});
        console.log(proveedorDB)
        res.render('detalleProv',{
            proveedor: proveedorDB,
            error:false
        })
    }catch(error){
        res.render('detalle',{
        error: true,
        mensaje: "No se encuentra el id escogido"
    })
    };
}); */

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

//Borrar 
/* router.delete('/:id', async (req, res)=>{
    const id = req.params.id;
    try{
        const proveedorDB = await Proveedor.findByIdAndDelete({_id: id});
        if (proveedorDB) {
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

//Aqui vamos a editar los proveedores creados
/* router.put('/:id', async(req, res)=>{
    const id = req.params.id;
    const body = req.body
    try{
        const proveedorDB = await Proveedor.findByIdAndUpdate(id, body, {useFindAndModify: false});
        console.log(proveedorDB);
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
}) */



module.exports = router;