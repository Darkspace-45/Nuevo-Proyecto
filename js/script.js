document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById('loading');
    window.addEventListener('load', function() {
        loader.style.display = 'none';
    });

    const toggleCarritoBtn = document.getElementById('toggle-carrito');
    const carrito = document.getElementById('carrito');
    const lista = document.querySelector("#lista-carrito tbody");
    const vaciarCarritobtn = document.getElementById('vaciar-carrito');
    const finalizarComprabtn = document.getElementById('finalizar-compra');
    const navbarLinks = document.querySelectorAll('.navbar ul li a');
    const totalElement = document.getElementById('total');

    let carritoAbierto = false;

    cargarEventListeners();

    function cargarEventListeners() {
        toggleCarritoBtn.addEventListener('click', toggleCarrito);
        vaciarCarritobtn.addEventListener('click', vaciarCarrito);
        finalizarComprabtn.addEventListener('click', finalizarCompra);
        navbarLinks.forEach(link => {
            link.addEventListener('click', setActiveClass);
        });

        document.addEventListener('click', function(e) {
            const clicEnCarrito = e.target.closest('#toggle-carrito');
            if (!clicEnCarrito && carritoAbierto) {
                ocultarCarrito();
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (carritoAbierto) {
                mostrarCarrito();
            }
        });

        const agregarCarritoBtns = document.querySelectorAll('.agregar-carrito');
        agregarCarritoBtns.forEach(btn => {
            btn.addEventListener('click', comprarElemento);
        });

        lista.addEventListener('click', aumentarCantidad);

        lista.addEventListener('click', eliminarElemento);
    }

    function toggleCarrito() {
        carritoAbierto = !carritoAbierto;
        if (carritoAbierto) {
            mostrarCarrito();
        } else {
            ocultarCarrito();
        }
    }

    function comprarElemento(e) {
        e.preventDefault();
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }

    function leerDatosElemento(elemento) {
        const infoElemento = {
            imagen: elemento.querySelector('img').src,
            titulo: elemento.querySelector('h3').textContent,
            precio: elemento.querySelector('.precio').textContent,
            id: elemento.querySelector('a').getAttribute('data-id')
        }
        insertarCarrito(infoElemento);
    }

    function insertarCarrito(elemento) {
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
    <td class="producto-info">
        <img src="${elemento.imagen}" width=50>
        <span class="producto-titulo">${elemento.titulo}</span>
    </td>
    <td class="producto-cantidad">
        <span class="cantidad">1</span>
    </td>
    <td class="producto-precio">
        ${elemento.precio}
    </td>
    <td class="producto-eliminar">
        <a href="#" class="borrar" data-id="${elemento.id}" style="color: red;"> X </a>
    </td>
`;
            lista.appendChild(row);
        }

        actualizarTotal();
        mostrarCarrito();
    }

    function aumentarCantidad(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const elemento = e.target.parentElement.parentElement;
            leerDatosElemento(elemento);
        }
    }

    function aumentarCantidadProducto(producto) {
        const cantidadElemento = producto.querySelector('.cantidad');
        let cantidad = parseInt(cantidadElemento.textContent);
        cantidad++;
        cantidadElemento.textContent = cantidad;
    }

    function eliminarElemento(e) {
        e.preventDefault();
        if (e.target.classList.contains('borrar')) {
            const producto = e.target.parentElement.parentElement;
            producto.remove();
            actualizarTotal();
        }
    }

    function vaciarCarrito() {
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
        actualizarTotal();
        ocultarCarrito();
        return false;
    }

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

    function setActiveClass(e) {
        navbarLinks.forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
    }

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

    function mostrarCarrito() {
        carrito.classList.add('visible');
    }

    function ocultarCarrito() {
        carrito.classList.remove('visible');
    }
});

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