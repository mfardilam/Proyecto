//Autenticación local
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Llamada al modelo de datos
const User = require('../models/usuarios');


//Serializar datos para que pasen de pag en pag y el programa no solicite autenticacion al user en otras secciones
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//Des-serializar, busca en BD
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

//Qué hacer con los datos del cliente, {objeto de configuración}
//, (funcion para decirle que hara con los datos),
passport.use('local-singup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
//request para poder recibir cualquier otro tipo de dato adicional, direccion, telefono y así
//done: para devolverle una rta al cliente

    const existe = await User.findOne({username: username});//Busque si el nombre que ingresan está en la BD
    const body = req.body;
    if(existe){
        return done(null, false, req.flash('singupMessage','El usuario ya existe'));
    } else{
        
        const nuevoUsuario = new User(body);
        nuevoUsuario.username = username;
        nuevoUsuario.password = nuevoUsuario.encryptPassword(password);
        console.log(nuevoUsuario);
        await nuevoUsuario.save(); //Cuando termine de guardar, continue con la sigu linea
        done(null, nuevoUsuario);//null para un error y user del usuario que registro
    }   
}));

passport.use('local-singin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=> {
    //Comprobacion de si el user existe en la
    const existeUsuario = await User.findOne({username: username});
    if(!existeUsuario){
        return done(null, false, req.flash('singinMessage', 'Usuario no encontrado'));
    }
    if(!existeUsuario.validarPass(password)){
        return done(null, false, req.flash('singinMessage','Contraseña incorrecta'));
    }
    return done(null, existeUsuario);
}));