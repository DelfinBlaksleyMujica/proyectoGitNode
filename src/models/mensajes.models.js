//Conexion a Mongoose para armar Schema

const mongoose = require("mongoose");

//Creo una coleccion dentro de la DB de MongoAtlas

const mensajesCollection = "mensajes";

const mensajesSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    mensaje:{
        type:String,
        required: true
    }
});

const MensajesModel = mongoose.model( mensajesCollection , mensajesSchema );

module.exports = { MensajesModel };