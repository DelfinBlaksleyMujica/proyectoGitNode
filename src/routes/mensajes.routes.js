//Conexion con express y Router
const Router = require("express").Router;


//Middlewares Locales

const { checkUserLogged, userNotLogged , isValidToken , soloAdmins  } = require("../middlewares/auth.middlewares");

//Dotenv

const dotenv = require("dotenv");
dotenv.config();

//Models

const { MensajesModel } = require("../models/mensajes.models");
const { UserModel } = require("../models/user.models");


//Contenedor

const ContenedorMensajesMongoDb = require("../contenedores/ContenedorMensajesMongoDB.js");
const mensajesApi = new ContenedorMensajesMongoDb( MensajesModel);



const ContenedorMensajesArchivo = require("../contenedores/ContenedorMensajesArchivo.js");
const mensajesArchivo = new ContenedorMensajesArchivo("mensajes.json");


//Router

const router = Router();

//Me traigo productos de la DB de archivos para pasrle al handlebars

const productosParaFront = require("../DB/productos.json");
const mensajesParaFront = require("../DB/mensajes.json");

//Endpoints

/*POST*/

router.post('/api/mensajes', checkUserLogged, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.session.passport.user});
        console.log("User: " , user);
        if (req.body) {
            const objMensaje = {
                username: user.username,
                date: Date(),
                mensaje: req.body.mensaje
            };
            const nuevoMensaje = await mensajesApi.guardar( objMensaje );
            const mensajeArchivo = await mensajesArchivo.save( objMensaje );
            console.log("Mensaje para archivo: " , mensajeArchivo );
            console.log(`Mensaje nuevo agregado a la base de datos: ${ nuevoMensaje }`);
            res.render("home" , { username: user.username , mensajes:mensajesParaFront })
        }else{
            console.log("No hay mensaje para enviar");
            res.status(200).send({ message:"Debe completar el formulario de mensaje para poder cargarlo" })
        }
    }catch ( error ) {
        console.log("No se pudo agregar el mensaje a la base de datos");
        res.status(500).send({ message : error.message })
    }  
})




module.exports = { MensajesRouter: router  };