document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById('loading');
    window.addEventListener('load', function() {
        loader.style.display = 'none';
    });

    // Selección de elementos del DOM
    const toggleCarritoBtn = document.getElementById('toggle-carrito');
    const carrito = document.getElementById('carrito');
    const lista = document.querySelector("#lista-carrito tbody");
    const vaciarCarritobtn = document.getElementById('vaciar-carrito');
    const finalizarComprabtn = document.getElementById('finalizar-compra');
    const navbarLinks = document.querySelectorAll('.navbar ul li a');
    const totalElement = document.getElementById('total');

    // Variable para controlar el estado del carrito
    let carritoAbierto = false;

    // Cargar event listeners
    cargarEventListeners();

    function cargarEventListeners() {
        toggleCarritoBtn.addEventListener('click', toggleCarrito);
        vaciarCarritobtn.addEventListener('click', vaciarCarrito);
        finalizarComprabtn.addEventListener('click', finalizarCompra);
        navbarLinks.forEach(link => {
            link.addEventListener('click', setActiveClass);
        });

        // Mantener abierto el carrito al hacer clic fuera de él
        document.addEventListener('click', function(e) {
            const clicEnCarrito = e.target.closest('#toggle-carrito');
            if (!clicEnCarrito && carritoAbierto) {
                ocultarCarrito();
            }
        });

        // Mostrar carrito al pasar el cursor sobre la pantalla
        document.addEventListener('mousemove', function(e) {
            if (carritoAbierto) {
                mostrarCarrito();
            }
        });

        // Agregar evento para comprar un elemento
        const agregarCarritoBtns = document.querySelectorAll('.agregar-carrito');
        agregarCarritoBtns.forEach(btn => {
            btn.addEventListener('click', comprarElemento);
        });

        // Agregar evento para aumentar la cantidad de productos
        lista.addEventListener('click', aumentarCantidad);

        // Agregar evento para eliminar producto del carrito
        lista.addEventListener('click', eliminarElemento);
    }

    // Función para alternar la visibilidad del carrito
    function toggleCarrito() {
        carritoAbierto = !carritoAbierto;
        if (carritoAbierto) {
            mostrarCarrito();
        } else {
            ocultarCarrito();
        }
    }

    // Función para comprar un elemento
    function comprarElemento(e) {
        e.preventDefault();
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
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
        // Verificar si el producto ya está en el carrito
        const productosEnCarrito = lista.querySelectorAll('tr');
        let productoExistente = false;

        productosEnCarrito.forEach(producto => {
            const idProducto = producto.querySelector('.borrar').getAttribute('data-id');
            if (idProducto === elemento.id) {
                productoExistente = true;
                aumentarCantidadProducto(producto);
            }
        });

        if (!productoExistente) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${elemento.imagen}" width=50>
                </td>
                <td>
                    ${elemento.titulo}
                </td>
                <td>
                    <span class="cantidad">1</span>
                </td>
                <td>
                    ${elemento.precio}
                </td>
                <td>
                    <a href="#" class="borrar" data-id="${elemento.id}" style="color: red;"> X </a>
                </td>
            `;
            lista.appendChild(row);
        }

        actualizarTotal();
        mostrarCarrito();
    }

    // Función para aumentar la cantidad de un producto en el carrito
    function aumentarCantidad(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const elemento = e.target.parentElement.parentElement;
            leerDatosElemento(elemento);
        }
    }

    // Función para aumentar la cantidad de un producto existente en el carrito
    function aumentarCantidadProducto(producto) {
        const cantidadElemento = producto.querySelector('.cantidad');
        let cantidad = parseInt(cantidadElemento.textContent);
        cantidad++;
        cantidadElemento.textContent = cantidad;
    }

    // Función para eliminar un elemento del carrito
    function eliminarElemento(e) {
        e.preventDefault();
        if (e.target.classList.contains('borrar')) {
            const producto = e.target.parentElement.parentElement;
            producto.remove();
            actualizarTotal();
        }
    }

    // Función para vaciar el carrito
    function vaciarCarrito() {
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
        actualizarTotal();
        ocultarCarrito();
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
                precio: row.querySelector('td:nth-child(4)').textContent
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
        const productos = lista.querySelectorAll('tr');
        productos.forEach(producto => {
            const precioProducto = producto.querySelector('td:nth-child(4)').textContent;
            const cantidadProducto = parseInt(producto.querySelector('.cantidad').textContent);
            total += parseFloat(precioProducto.replace('$', '')) * cantidadProducto;
        });
        totalElement.textContent = total.toFixed(2);
    }

    // Función para mostrar el carrito
    function mostrarCarrito() {
        carrito.classList.add('visible');
    }

    // Función para ocultar el carrito
    function ocultarCarrito() {
        carrito.classList.remove('visible');
    }
});

// Añade este script al final de tu archivo HTML o en un archivo JS separado
document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});