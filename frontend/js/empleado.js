if (!localStorage.getItem('usuario_rol')) {
    alert('Por favor, inicia sesión para acceder al sistema.');
    window.location.href = 'index.html';
}

const API_PRODUCTOS = 'http://localhost:3000/api/productos';
const API_FACTURAS = 'http://localhost:3000/api/facturas';

let productosInventario = [];
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

// Cargar catálogo desde el Backend
async function cargarProductos() {
    try {
        const respuesta = await fetch(API_PRODUCTOS);
        productosInventario = await respuesta.json();
        renderizarTablaStock();
    } catch (error) {
        console.error('Error al cargar inventario:', error);
    }
}

// Mostrar los productos disponibles
function renderizarTablaStock() {
    const tbody = document.getElementById('tablaProductosEmpleado');
    tbody.innerHTML = '';

    productosInventario.forEach(prod => {
        const botonDeshabilitado = prod.stock <= 0 ? 'disabled' : '';
        tbody.innerHTML += `
            <tr>
                <td><strong>${prod.nombre}</strong></td>
                <td>$${prod.precio}</td>
                <td>${prod.stock > 0 ? prod.stock : '<span style="color:red">Agotado</span>'}</td>
                <td>
                    <button onclick="agregarAlCarrito(${prod.id})" ${botonDeshabilitado} style="background: #007bff; color: white; border:none; padding: 4px 8px; cursor:pointer;">
                        + Añadir
                    </button>
                </td>
            </tr>
        `;
    });
}

// Añadir un ítem al carrito de compras virtual
function agregarAlCarrito(id) {
    const prod = productosInventario.find(p => p.id === id);
    const itemCarrito = carrito.find(item => item.producto_id === id);

    // Validar si estamos superando el stock disponible real
    const cantidadEnCarrito = itemCarrito ? itemCarrito.cantidad : 0;
    if (cantidadEnCarrito >= prod.stock) {
        alert('No puedes agregar más unidades de las que hay en stock.');
        return;
    }

    if (itemCarrito) {
        itemCarrito.cantidad += 1;
    } else {
        carrito.push({
            producto_id: prod.id,
            nombre: prod.nombre,
            cantidad: 1,
            precio_unitario: parseFloat(prod.precio)
        });
    }
    actualizarVistaCarrito();
}

// Actualizar la interfaz del carrito y calcular el precio total
function actualizarVistaCarrito() {
    const tbody = document.getElementById('carritoVenta');
    tbody.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.cantidad * item.precio_unitario;
        total += subtotal;
        tbody.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio_unitario.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById('totalVenta').innerText = total.toFixed(2);
}

// Enviar la estructura de la venta al servidor backend
async function procesarCobro() {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    const total = parseFloat(document.getElementById('totalVenta').innerText);
    
    // Armamos la estructura que el controlador espera recibir
    const datosFactura = {
    total: total,
    // Recuperamos el ID del usuario que guardó el login en el navegador
    usuario_id: parseInt(localStorage.getItem('usuario_id')), 
    productos: carrito
};

    try {
        const respuesta = await fetch(API_FACTURAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFactura)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert(`¡Venta cobrada con éxito! Factura N°: ${resultado.facturaId}`);
            carrito = []; // Limpiamos la caja
            actualizarVistaCarrito();
            cargarProductos(); // Recargamos stock actualizado de inmediato
        } else {
            alert(`Error: ${resultado.error}`);
        }
    } catch (error) {
        console.error('Error al procesar cobro:', error);
    }
}