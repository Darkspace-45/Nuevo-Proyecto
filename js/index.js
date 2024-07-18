window.addEventListener('load', function () {
    document.getElementById('loading').style.display = 'none';
});

let productos = [];

const agregarProducto = (id, producto, precio) => {
    let indice = productos.findIndex(p => p.id == id);

    if (indice != -1) {
        productos[indice].cantidad++;
        productos[indice].total = productos[indice].cantidad * productos[indice].precio;
        putJSON(productos[indice]);
    } else {
        productos.push({
            id: id,
            producto: producto,
            precio: precio,
            cantidad: 1,
            total: precio 
        });
        postJSON(productos[productos.length - 1]);
    }

    actualizarTabla();
};

// Función para actualizar la tabla del carrito
const actualizarTabla = () => {
    let tbody = document.getElementById('tbody');
    let total = 0;

    tbody.innerHTML = '';

    for (let item of productos) {
        let fila = tbody.insertRow();

        let celdaProducto = fila.insertCell(0);
        let celdaCantidad = fila.insertCell(1);
        let celdaPrecio = fila.insertCell(2);
        let celdaTotal = fila.insertCell(3);
        let celdaBoton = fila.insertCell(4);

        celdaProducto.textContent = item.producto;
        celdaCantidad.textContent = item.cantidad;
        celdaPrecio.textContent = `$${item.precio.toFixed(2)}`;
        celdaTotal.textContent = `$${item.total.toFixed(2)}`;

        let boton = document.createElement('button');
        boton.textContent = 'Borrar';
        celdaBoton.appendChild(boton);

        boton.addEventListener("click", function () {
            eliminar(item.id);
        });

        total += item.total;
    }
    document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
};

// Función para eliminar un producto del carrito
const eliminar = (id) => {
    let indice = productos.findIndex(p => p.id == id);
    if (indice != -1) {
        productos.splice(indice, 1);
        actualizarTabla();
        deleteJSON(id);
    }
};

// Función para finalizar el pago y vaciar el carrito
const finalizarPago = () => {
    productos.forEach(item => deleteJSON(item.id));
    productos = [];
    actualizarTabla();
    alert("Pago completado y carrito vaciado.");
};

// Función para hacer una solicitud POST
async function postJSON(data) {
    try {
        const response = await fetch("http://localhost:3000/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para hacer una solicitud GET
async function getJSON() {
    try {
        const response = await fetch("http://localhost:3000/productos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        console.log("Success:", result);

        productos = result;
        actualizarTabla();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para hacer una solicitud PUT
async function putJSON(data) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para hacer una solicitud DELETE
async function deleteJSON(id) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE",
        });
        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para cargar los datos del carrito al cargar la página
window.onload = function () {
    getJSON();
};

document.querySelectorAll('.agregar-carrito').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        const id = this.getAttribute('data-id');
        const producto = this.previousElementSibling.previousElementSibling.textContent;
        const precio = parseFloat(this.previousElementSibling.textContent.replace('$', ''));
        agregarProducto(id, producto, precio);
    });
});

document.getElementById('finalizar-pago').addEventListener('click', function () {
    finalizarPago();
});

document.addEventListener("DOMContentLoaded", function() {
    const orderItemsContainer = document.getElementById('tbody');
    const orderTotal = document.getElementById('order-total');

    const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    function mostrarResumenPedido() {
        cartItems.forEach((item) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.name}" style="width: 50px;">
                    ${item.name}
                </td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="btn-remove" data-id="${item.id}">Eliminar</button></td>
            `;
            orderItemsContainer.appendChild(tr);

            total += item.price * item.quantity;
        });

        orderTotal.textContent = `$${total.toFixed(2)}`;
    }

    mostrarResumenPedido();

    orderItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove')) {
            const itemId = e.target.getAttribute('data-id');
            const itemIndex = cartItems.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                cartItems.splice(itemIndex, 1);
                localStorage.setItem('carrito', JSON.stringify(cartItems));
                orderItemsContainer.innerHTML = '';
                total = 0;
                mostrarResumenPedido();
            }
        }
    });

    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validarDatosTarjeta()) {
            alert('Pago procesado. Gracias por su compra!');
            localStorage.removeItem('carrito');
            orderItemsContainer.innerHTML = '';
            orderTotal.textContent = '$0.00';
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 1000);
        } else {
            alert('Por favor, revise los datos de la tarjeta.');
        }
    });

    function validarDatosTarjeta() {
        const cardName = document.getElementById('card-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvc = document.getElementById('cvc').value.trim();

        const nombreRegex = /^[a-zA-Z\s]+$/;
        if (!nombreRegex.test(cardName)) {
            return false;
        }

        const numTarjetaRegex = /^\d{16}$/;
        if (!numTarjetaRegex.test(cardNumber)) {
            return false;
        }

        const fechaExpiracionRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!fechaExpiracionRegex.test(expiryDate)) {
            return false;
        }

        const cvcRegex = /^\d{3}$/;
        if (!cvcRegex.test(cvc)) {
            return false;
        }

        return true;
    }
});
