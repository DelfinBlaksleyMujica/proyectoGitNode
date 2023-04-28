//Conexion al servidor

const express = require("express");

//Compresion GZIP

const compression = require("compression");

//Loggers 

const { logger } = require("../loggers/loggers");

//Global Process

const processId = process.pid;
const nodeVersion = process.version;
const nombreDeLaPlataforma = process.platform;
const memoriaTotalReservada = JSON.stringify(process.memoryUsage.rss());
const carpetaDelProyecto = process.cwd();
const argumentosDeEntrada = process.argv;
const processPath = process.execPath;

//Router

const router = express.Router();

//Conexion con MiddleWares Locales

const { checkUserLogged, userNotLogged , isValidToken } = require("../middlewares/auth.middlewares");


//Models

const { UserModel } = require("../models/user.models");

//Me traigo productos de la DB de archivos para pasrle al handlebars

const productosParaFront = require("../DB/productos.json");
const mensajesParaFront = require("../DB/mensajes.json");




//Endpoints
router.get("/" , checkUserLogged , async ( req , res ) => {
    const { url , method } = req;
    try {
            logger.info(`Ruta ${ method } ${ url } visitada`)
            const user = await UserModel.findOne({ _id: req.session.passport.user});
            res.render("home" , { username: user.username , mensajes:mensajesParaFront });
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
} );

router.get("/perfil" , isValidToken ,  ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`)
        res.render("profile" , { username: req.user.username })
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
});


router.get("/logout" , ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`)
        req.session.destroy((error) => {
        if (error) {
            console.log(error);
            res.redirect("/")
        } else {
            console.log("Se cerro la sesion correctamente");
            res.render("logout")
        }
    })
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
    
});

router.get("/info" ,checkUserLogged, ( req, res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        logger.info(`Argumentos de entrada: ${argumentosDeEntrada} \n nombreDeLaPlataforma: ${ nombreDeLaPlataforma } \n versionNode: ${ nodeVersion } \n memoriaTotalReservada: ${ memoriaTotalReservada } \n pathDeEjecucion: ${ pathDeEjecucion } \n processId: ${ processId } \n carpetaDelProyecto: ${ carpetaDelProyecto }` );
        res.render("serverInfo", { argumentosDeEntrada: argumentosDeEntrada , nombreDeLaPlataforma: nombreDeLaPlataforma , versionNode: nodeVersion , memoriaTotalReservada: memoriaTotalReservada , pathDeEjecucion: processPath , processId: processId , carpetaDelProyecto: carpetaDelProyecto  });
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
});

/*---------------Rutas info bloq y nobloq para analisis de performance-------------------*/

router.get("/info-nobloq" ,checkUserLogged, ( req, res ) => {
    const { url , method } = req;
    try {
        res.render("serverInfo", { argumentosDeEntrada: argumentosDeEntrada , nombreDeLaPlataforma: nombreDeLaPlataforma , versionNode: nodeVersion , memoriaTotalReservada: memoriaTotalReservada , pathDeEjecucion: processPath , processId: processId , carpetaDelProyecto: carpetaDelProyecto  });
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
});

router.get("/info-bloq" ,checkUserLogged, ( req, res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        logger.info(`Argumentos de entrada: ${argumentosDeEntrada} \n nombreDeLaPlataforma: ${ nombreDeLaPlataforma } \n versionNode: ${ nodeVersion } \n memoriaTotalReservada: ${ memoriaTotalReservada } \n pathDeEjecucion: ${ pathDeEjecucion } \n processId: ${ processId } \n carpetaDelProyecto: ${ carpetaDelProyecto }` );
        res.render("serverInfo", { argumentosDeEntrada: argumentosDeEntrada , nombreDeLaPlataforma: nombreDeLaPlataforma , versionNode: nodeVersion , memoriaTotalReservada: memoriaTotalReservada , pathDeEjecucion: processPath , processId: processId , carpetaDelProyecto: carpetaDelProyecto  });
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
});

/*---------------------------------------------------------------------*/


router.get("/productos" , checkUserLogged, async ( req, res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        res.render("productos", { products: productosParaFront });
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
    
});

router.get("/centro-de-mensajes" , checkUserLogged ,( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        res.sendFile("C:/Users/delfb/OneDrive/Escritorio/Programacion Backend/Entregas/DelfinBlaksleyMujica-Gzip-Loggers-y-analisis-de-performance/src/public/centroDeMensajes.html")
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
})




module.exports = { viewsRouter: router };