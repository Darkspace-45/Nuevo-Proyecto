document.addEventListener("DOMContentLoaded", function() {
    // Lógica para mostrar los productos seleccionados en el resumen del pedido
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    carrito.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${item.imagen}" width="50">
            <span>${item.titulo}</span>
            <span>${item.precio}</span>
        `;
        orderItemsContainer.appendChild(div);
        total += parseFloat(item.precio.replace('$', ''));
    });

    orderTotal.textContent = `$${total.toFixed(2)}`;

    // Lógica para manejar el formulario de pago
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Pago procesado. Gracias por su compra!');
        localStorage.removeItem('carrito');
        window.location.href = 'index.html';
    });
});
