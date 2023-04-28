const mongoose = require("mongoose");
const { options } = require("../config/options");

class ContenedorProductosMongoDb {
    constructor( productsModel ) {
        this.coleccion = productsModel;
    }

    
    async listar( id ) {
        const itemListado = await this.coleccion.find( { _id: id } );
        const itemListadoObj = itemListado[0];
        return itemListadoObj;
    }

    async listarAll() {
        const listado = await this.coleccion.find({})
        return listado;
    }

    async guardar( nuevoElem ){
        const elementoNuevo = new this.coleccion( nuevoElem );
        const savedNewElement = await elementoNuevo.save();
        return savedNewElement;
    }

    async addProduct( producto ) {
        try {
        const carts = await this.coleccion.find({}).sort({_id:-1})
        const cartToUpdate = carts[0];
        console.log(cartToUpdate);
        const updatedCart = await this.coleccion.updateOne( cartToUpdate , { $push: { productos: producto } } )
        return updatedCart;
        } catch (error) {
        console.log(error.message);
        return error.message;
        } 
    }

    async deleteProdFromCart( id , idProd ) {
        try {
            const itemListado = await this.coleccion.find( { _id: id } );
            const cartToUpdate = itemListado[0];
            /*console.log(cartToUpdate);*/
            const productToDelete = await cartToUpdate.productos.find( producto => producto._id == idProd )
            /*console.log(productToDelete);*/
            const updatedCart = await this.coleccion.updateOne( cartToUpdate , { $pull: { productos: productToDelete } } )
            console.log(updatedCart);
            console.log(`Se elimino el producto: ${ idProd } del carrito: ${ id }`);
            return updatedCart
        } catch (error) {
            console.log(error);
            return error.message
        }
    }

    async actualizar( id ,  nuevoElem ) {
        const { nombre , descripcion , precio , stock , thumbnail ,codigoDeProducto } = nuevoElem;
        const elementUpdate = await this.coleccion.updateOne( { _id: id } , { $set: { nombre: nombre , descripcion:descripcion , precio: precio , stock:stock , thumbnail:thumbnail , codigoDeProducto: codigoDeProducto } } )
        return elementUpdate;
    }

    async borrar( id ) {
        const itemListado = await this.coleccion.find( { _id: id } );
        const itemListadoObj = itemListado[0];
        console.log(`Chequeo: ${ itemListadoObj }`);
        if (itemListadoObj == undefined ) {
            return null
        }else {
            const userDeleted = await this.coleccion.deleteOne( { _id: id } )
            return itemListadoObj;
        }
        
    }

    async borrarAll() {

    }
}

module.exports = ContenedorProductosMongoDb;