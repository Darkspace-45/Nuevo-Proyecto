document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById('loading');
    window.addEventListener('load', function() {
        loader.style.display = 'none';
    });
});

// Selección de elementos del DOM
const carrito = document.getElementById('carrito');
const elemento1 = document.getElementById('lista-1');
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritobtn = document.getElementById('vaciar-carrito');
const finalizarComprabtn = document.getElementById('finalizar-compra');
const navbarLinks = document.querySelectorAll('.navbar ul li a');
const totalElement = document.getElementById('total');

// Cargar event listeners
cargarEventListeners();

function cargarEventListeners() {
    elemento1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritobtn.addEventListener('click', vaciarCarrito);
    finalizarComprabtn.addEventListener('click', finalizarCompra);
    navbarLinks.forEach(link => {
        link.addEventListener('click', setActiveClass);
    });
}

// Función para comprar un elemento
function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

// Función para leer los datos del elemento
function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(infoElemento);
}

// Función para insertar el elemento en el carrito
function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width=50>
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            ${elemento.precio}
            <a href="#" class="borrar" data-id="${elemento.id}" style="margin-left: 10px; color: red;"> X </a>
        </td>
    `;
    lista.appendChild(row);
    actualizarTotal();
}

// Función para eliminar un elemento del carrito
function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        e.target.parentElement.parentElement.remove();
        actualizarTotal();
    }
}

// Función para vaciar el carrito
function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    actualizarTotal();
    return false;
}

// Función para finalizar la compra
function finalizarCompra(e) {
    e.preventDefault();
    const carrito = [];
    lista.querySelectorAll('tr').forEach(row => {
        const item = {
            imagen: row.querySelector('img').src,
            titulo: row.querySelector('td:nth-child(2)').textContent,
            precio: row.querySelector('td:nth-child(3)').textContent
        };
        carrito.push(item);
    });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.href = 'checkout.html';
}

// Función para cambiar la clase activa en el navbar
function setActiveClass(e) {
    navbarLinks.forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
}

// Función para actualizar el total
function actualizarTotal() {
    let total = 0;
    const precios = lista.querySelectorAll('tr td:nth-child(3)');
    precios.forEach(precio => {
        total += parseFloat(precio.textContent.replace('$', ''));
    });
    totalElement.textContent = total.toFixed(2);
}
