const express = require('express');
const router = express.Router();

const passport = require('passport');
const multer = require('multer');
const csv = require('csvtojson');
const path = require('path');

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect('/singin');
};


router.get('/', isAuthenticated, (req, res, next) =>{
    res.render('productos');
});