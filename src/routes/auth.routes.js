//Conexion con express y Router

const Router = require("express").Router;

//Loggers

const { logger } = require("../loggers/loggers");

//Middlewares Locales

const { checkUserLogged, userNotLogged , isValidToken } = require("../middlewares/auth.middlewares");

//Conexion con Passport

const passport = require("passport");

//Conexion con Estrategias de Passport

const LocalStrategy = require("passport-local").Strategy;

//Conexion con JWT

const jwt = require("jsonwebtoken");

//Dotenv

const dotenv = require("dotenv");
dotenv.config();

//Conexion con bycrypt

const bcrypt = require("bcrypt");


//Models

const { UserModel } = require("../models/user.models");

//Router

const router = Router();

//Serializacion

passport.serializeUser( ( user , done ) => {
    return done( null , user.id)
});

//Deserialializacion

passport.deserializeUser( ( id , done ) => {
    UserModel.findById( id , ( err , userDB) => {
        return done( err , userDB );
    })
});

//Estrategia para registrar usuarios

passport.use( "signupStrategy" , new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField:"email"
    },
    ( req , username , password , done ) => {
        console.log( "body" , req.body );
        //Verifico si el usuario ya existe en la DB
        UserModel.findOne({ username: username} , async ( err , userDB ) => {
            if(err) return done(err , false , { message: `Hubo un error al buscar el usuario ${err}`});
            if(userDB) return done( null , false , { message: "El usuario ya existe" } );
            //Si el usuario no existe lo creo en la DB
            const salt = Number(process.env.SALT);
            const hashPassword = await bcrypt.hash( password , salt  );
            const newUser = {
                name: req.body.name,
                username: username,
                password: hashPassword
            };
            UserModel.create( newUser , ( err , userCreated ) => {
                if(err) return done( err , false , { message: "Hubo un error al crear el usuario" } )
                return done( null , false, { message: "Usuario creado" } );
            })
        })
    } 
));


passport.use("loginStrategy" , new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField: "username"
    },
    ( req ,username , password , done ) => {
        UserModel.findOne( { username: username } , async ( err , userDB ) => {
            if( err ) return done( err , false , { message: `Hubo un error al buscar el usuario ${err}`});
            if( !userDB ) return done( null , false , { message: "El usuario no esta registrado" } );
            const validPassword = await bcrypt.compare( password , userDB.password );
            if ( validPassword === false ) return done( err , false , { message: "El usuario y la contraseña no coinciden con un usuario registrado"} );
            req.session.username = username;
            return done( null , userDB , { message: "El usuario esta ok"})
        })
    }
))

//Endpoints

/*GET*/

router.get("/registro" , userNotLogged , ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const errorMsg = req.session.messages ? req.session.messages[0] : "";
        res.render( "signup" , { error: errorMsg } );
        req.session.messages = [];
    } catch (error) {
        logger.error("Error en el get de productos");
        res.status(500).send({ message: error.message });
    }
    
});

router.get("/inicio-de-sesion"  , userNotLogged , ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        res.render("login");
    } catch (error) {
        logger.error("Error en el get de productos");
        res.status(500).send({ message: error.message });
    }
    
});

router.get("/login" , userNotLogged , ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const errorMsg = req.session.messages ? req.session.messages[0] : "";
        res.render( "login" , { error: errorMsg } );
        req.session.messages = [];
    } catch (error) {
        logger.error("Error en el get de productos");
        res.status(500).send({ message: error.message });
    }
    
});


/*POST*/

router.post("/signup" , passport.authenticate("signupStrategy" , {
    failureRedirect: "/registro",
    failureMessage: true
}),( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        res.render("login");
    } catch (error) {
        logger.error("Error en el get de productos");
        res.status(500).send({ message: error.message });
    }
    
});

router.post("/login" , passport.authenticate("loginStrategy" , {
    failureRedirect: "/login",
    failureMessage: true
}) , ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const { username  } = req.body;
        jwt.sign({ username: username } , "claveToken" , { expiresIn:"7d"} , ( error , token ) => {
        req.session.acces_token = token;
        })
        res.render("home" , { username: username });
    } catch (error) {
        logger.error("Error en el get de productos");
        res.status(500).send({ message: error.message });
    }
});



module.exports = { AuthRouter: router };