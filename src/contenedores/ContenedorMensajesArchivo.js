const fs = require("fs");
const path = require("path");

class ContenedorMensajesArchivo {
    constructor(filename){
        this.filename = path.join(__dirname,"..",`DB/${filename}`);
    }

save = async (mensaje) => {
    try {
        //Leer el archivo existe
        if (fs.existsSync(this.filename)) {
            const mensajes = await this.getAll();
            const lastIdAdded = mensajes.reduce((acc , item) => item.id > acc ? acc = item.id : acc, 0);
            const nuevoMensaje = {
                id: lastIdAdded + 1,
                ...mensaje
            }
            mensajes.push(nuevoMensaje);
            await fs.promises.writeFile(this.filename , JSON.stringify(mensajes , null , 2))
            return mensajes;
            
        } else {
            //Si el archivo no existe
            const nuevoMensaje = {
                id:1,
                ...mensaje
            }
            //Creamos el archivo
            await fs.promises.writeFile(this.filename , JSON.stringify([nuevoMensaje] , null , 2));
            return nuevoMensaje
        }
    } catch (error) {
        console.log("error saving" , error);
    }
}

getById = async(id) =>{
    try {
        if (fs.existsSync(this.filename)){
            const mensajes = await this.getAll()
            const mensaje = mensajes.find(item => item.id === id)
            return mensaje
        }        
    } catch (error) {
        console.log(error);
    }
}

getAll = async() =>{
    try {
        const contenido = await fs.promises.readFile(this.filename , "utf-8");
        const mensajes = JSON.parse(contenido);
        return mensajes
    } catch (error) {
        console.log(error);
    }
}

deleteById = async(id) => {
    try {
        const mensajes = await this.getAll();
        const nuevosMensajes = mensajes.filter(item => item.id !== id);
    } catch (error) {
        console.log(error);
    }
}

deleteAll = async () => {
    try {
        await fs.promises.writeFile( this.filename , JSON.stringify([]));
    } catch (error) {
        console.log(error);
    }
}

updateById = async() =>{
    try {
        const mensajes = await this.getAll();
        const mensajePos = mensajes.findIndex( elm => elm.id === id);
        mensajes[mensajePos] = {
            id:id,
            ...body
        };
        await fs.promises.writeFile(this.filename , JSON.stringify(productos, null , 2))
        return mensajes;
    } catch (error) {
        console.log(error);
    }
}
}


module.exports = ContenedorMensajesArchivo;