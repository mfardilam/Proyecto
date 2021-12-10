const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');
const Productos = require('../models/csv');

//Aqui vamos a llamar la vista de ventas
router.get('/', (req, res) => {
  return res.render('ventas');
});

router.post('/', (req, res) => {
  //const
  const request = req.body;
  //return res.send(request);  
  return res.json({ success: true, msg: "Venta confirmada", successive: 2  });
});

router.get('/search/customer', (req, res) => {
  const term = req.query['term'];
  //Array de la BD
  //const customers =  await Cliente.find();
  const customers = [
    {
      "id": 1,
      "cedula": "3256984",
      "name": "Pepito Martinez",
    },
    {
      "id": 2,
      "cedula": "63485721",
      "name": "Rafael Perez",
    },
    {
      "id": 3,
      "cedula": "123456",
      "name": "Maria Casa",
    },
    {
      "id": 4,
      "cedula": "147258",
      "name": "Alejandro Jimenez",
    },
  ];
  //Para cada registro tome la cedula e igualela a term 
  const found = customers.find( cliente => cliente.cedula == term );
  //return res.send(found);
  
  return res.json(found || null);
});

router.get('/search/item', (req, res) => {
  const term = req.query['term'];
  //const items = await Productos.find();
  const items = [
    {
      "id": 1,
      "code": "1101",
      "name": "Primer 24K Gold de Kiss Beauty",
      "cost": 15000,
    },
    {
      "id": 2,
      "code": "1201",
      "name": "Beauty Blende",
      "cost": 4000,
    },
    {
      "id": 3,
      "code": "1301",
      "name": "Base BB Engol",
      "cost": 15000,
    },
    {
      "id": 4,
      "code": "1401",
      "name": "Iluminador con pomo y espejo Engol",
      "cost": 10000,
    },
    {
      "id": 5,
      "code": "1503",
      "name": "Delineador doble punta 36h SMI",
      "cost": 7000,
    },
    {
      "id": 6,
      "code": "1601",
      "name": "Brillo magico",
      "cost": 8500,
    },
  ];
  if(!items){
    console.log('Existe')
  }
  const found = items.find( item => item.code === term );

  //return res.send(found);
  return res.json(found || null);
})

module.exports = router;