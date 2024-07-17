document.addEventListener("DOMContentLoaded", function() {
    // Lógica para mostrar los productos seleccionados en el resumen del pedido
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    carrito.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('order-item'); // Agregamos una clase para los estilos
        div.innerHTML = `
            <img src="${item.imagen}" width="50">
            <span>${item.titulo}</span>
            <span>${item.precio}</span>
        `;
        if (index < carrito.length - 1) {
            const separator = document.createElement('hr');
            div.appendChild(separator); // Agregamos un separador si no es el último elemento
        }
        orderItemsContainer.appendChild(div);
        total += parseFloat(item.precio.replace('$', ''));
    });

    orderTotal.textContent = `$${total.toFixed(2)}`;

    // Lógica para manejar el formulario de pago
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validarDatosTarjeta()) {
            alert('Pago procesado. Gracias por su compra!');
            localStorage.removeItem('carrito');
            window.location.href = 'index.html';
        } else {
            alert('Por favor, revise los datos de la tarjeta.');
        }
    });

    // Función para validar los datos de la tarjeta
    function validarDatosTarjeta() {
        const cardName = document.getElementById('card-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvc = document.getElementById('cvc').value.trim();

        // Validar nombre en la tarjeta (solo letras y espacios)
        const nombreRegex = /^[a-zA-Z\s]+$/;
        if (!nombreRegex.test(cardName)) {
            return false;
        }

        // Validar número de tarjeta (16 dígitos numéricos)
        const numTarjetaRegex = /^\d{16}$/;
        if (!numTarjetaRegex.test(cardNumber)) {
            return false;
        }

        // Validar fecha de expiración (formato MM/YY)
        const fechaExpiracionRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!fechaExpiracionRegex.test(expiryDate)) {
            return false;
        }

        // Validar CVC (3 dígitos numéricos)
        const cvcRegex = /^\d{3}$/;
        if (!cvcRegex.test(cvc)) {
            return false;
        }

        return true;
    }
});
