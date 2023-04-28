//--------------------------------------------------
//CONEXION CON PARA WEBSOCKETS

const socket = io.connect();


//-------------------------------------------------
//Fetch de productos al endpoint
let catalogo = [];

async function fetchProductos() {
    const respuesta = await fetch("/api/productos")
    return await respuesta.json()
}

fetchProductos().then(productos => {
    catalogo = productos
    console.log(catalogo);
})



//--------------------------------------------------
//Renders

const render = ( data ) => {
    const html = data.map(( element , index ) => {
        return`
                <div>
                <strong style="color:blue">${element.author}</strong>
                <em style="color:brown">${element.timestamp}:</em>
                <em style="color:green">${element.text}</em>
                </div>`;
    });
    document.getElementById("messages").innerHTML = html;
};

const renderProduct = ( data )=> {
    const html = data.map(( product , index ) => {
        return`
        <tr>
        <td>${product.nombre}</td>
        <td>$${product.precio}</td>
        <td><img src="${product.thumbnail}" width="100" height="100" alt="Imagen de producto"></td>
    </tr>`
    });
    document.getElementById("products").innerHTML = html;
};

const renderCompressionNumber = ( data )=> {
    const html = `${ data }`

    document.getElementById("compresion-info").innerHTML = html;
};

const idRandomButton = document.getElementById("id-aleatorio");

function generateRandomNumber() {
    const numero = Math.floor(Math.random() * 100000);
    return numero;
}

function insertarNumeroAleatorio() {
    const numeroAleatorio = generateRandomNumber();
    idRandomButton.innerHTML = numeroAleatorio;
    return numeroAleatorio;
}



function addMessage(e) {
    const mensaje= {
        author:
        {   
            id: document.getElementById("username").value,
            username: document.getElementById("username").value,
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            age: document.getElementById("age").value,
            alias: document.getElementById("alias").value,
            avatar: document.getElementById("avatar").value,
        },
        timestamp: Date(),
        text: document.getElementById("mensaje").value
    };
    socket.emit("new-message" , mensaje );
    document.getElementById("username").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("age").value = "";
    document.getElementById("alias").value = "";
    document.getElementById("avatar").value = "";
    document.getElementById("mensaje").value = "";
    /*Hacemos un return false para que no se nos recargue la pagina cuando clickeamos el button*/
    return false;
}


function addProduct(e) {
    const product= {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    };
    socket.emit("new-product" , product );
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("thumbnail").value = "";
    /*Hacemos un return false para que no se nos recargue la pagina cuando clickeamos el button*/
    return false;
}

socket.on("products" , ( data ) => renderProduct( data ) );
socket.on("messages" , (data) => render(data));
socket.on("porcentajeDeCompresion" , ( data ) => renderCompressionNumber( data ) )




