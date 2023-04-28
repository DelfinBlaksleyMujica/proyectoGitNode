//Dotenv

const dotenv = require("dotenv");
dotenv.config();
const staticDir = process.env.STATIC_DIR;
const sessionSecret = process.env.SECRET_SESSION;

//Conexion de Servidor

const express = require("express");
const app = express();
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);

const { options } = require("./config/options");
const PORT = process.env.PORT || 8080;
const handlebars = require("express-handlebars");

//Compresion GZIP para mejorar rendimientos de la app

const compression = require("compression");
/*Comprimo toda la aplicacion con la siguiente linea*/ 
app.use(compression());

//Loggers

const { logger } = require("./loggers/loggers");

//Cluster

const cluster = require("cluster");
const os = require("os");
const numCores = os.cpus().length;

//Conexion con routers

const { viewsRouter } = require("./routes/views.routes");
const { AuthRouter } = require("./routes/auth.routes");
const { ProductsRouter } = require("./routes/products.routes");
const { MensajesRouter } = require("./routes/mensajes.routes");

//Conexion de Sessions

const session = require("express-session");
const cookieParser = require("cookie-parser");

//Conexion con Middleware de Autenticacion Passport

const passport = require("passport");

//Conexion con Base de datos 

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

//Conexion con mongoose

mongoose.connect( options.mongoDB.url , options.mongoDB.options )
.then( () => {
    logger.info("Base de datos conectada exitosamente!!");
});

//Configuracion de la session

app.use(cookieParser());

//Modo Cluster o Fork

if ( options.server.MODO === "CLUSTER" && cluster.isPrimary ) {
    
    for (let i = 0; i < numCores; i++) {
        cluster.fork();
    }

    cluster.on( "exit", ( worker ) => {
        console.log(`Proceso ${ worker.process.pid } murio`);
        cluster.fork();
    });
    
} else {

    //Conexion del servidor
    const server = httpServer.listen( PORT , () => {
        logger.info( `Server listening on port ${ server.address().port } on process ${ process.pid }` );
    });
    server.on( "error" , error => logger.info(`Error en el servidor: ${error}` ) );
    
    //Servicio estaticos
    app.use( express.static( __dirname+`/${staticDir}` ) );

    //Motor de plantilla
    app.engine("handlebars" , handlebars.engine() );
    app.set( "views" , __dirname+"/public/views" );
    app.set("view engine" , "handlebars" );

    //Interpretacion de formatos
    app.use( express.json() );
    app.use( express.urlencoded( { extended: true } ) );
    app.use(express.static('./public'))
    app.use(session({
        store: MongoStore.create({
            mongoUrl: options.mongoDB.url,
            ttl:600
        }),
        secret: sessionSecret,
        resave: true,
        saveUninitialized: true
    }));
    //Configuracion de Passport
    app.use( passport.initialize() );
    app.use( passport.session() );
    
    //Routes
    app.use( viewsRouter );
    app.use( AuthRouter );
    app.use( ProductsRouter );
    app.use( MensajesRouter );

    app.get('*', (req, res) => {
        const { url, method } = req
        logger.warn(`Ruta ${method} ${url} no implementada`);
        res.send(`Ruta ${method} ${url} no está implementada`);
    });
    
}



