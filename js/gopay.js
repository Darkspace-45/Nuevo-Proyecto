window.addEventListener('scroll', function() {
    var floatingButton = document.querySelector('.floating-button');
    if (window.scrollY > 300 && tieneElementosEnCarrito()) { 
        floatingButton.style.display = 'block';
    } else {
        floatingButton.style.display = 'none';
    }
});

function tieneElementosEnCarrito() {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    return carrito.length > 0;
}

window.addEventListener('load', function() {
    actualizarBotonFlotante();
});

window.addEventListener('storage', function(event) {
    if (event.key === 'carrito') {
        actualizarBotonFlotante();
    }
});

function actualizarBotonFlotante() {
    var floatingButton = document.querySelector('.floating-button');
    if (tieneElementosEnCarrito()) {
        floatingButton.style.display = 'block';
    } else {
        floatingButton.style.display = 'none';
    }
}
