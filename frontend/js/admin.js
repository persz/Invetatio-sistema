const API_URL = '/api/productos';

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarFacturas(); 
    
    document.getElementById('productoForm').addEventListener('submit', guardarProducto);
});

// Cargar inventario completo
async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const productos = await respuesta.json();
        const tbody = document.getElementById('tablaProductosAdmin');
        tbody.innerHTML = '';

        productos.forEach(prod => {
            tbody.innerHTML += `
                <tr>
                    <td>${prod.id}</td>
                    <td>${prod.nombre}</td>
                    <td>$${prod.precio}</td>
                    <td>${prod.stock}</td>
                    <td>
                        <button class="btn-edit" onclick="prepararEdicion(${prod.id}, '${prod.nombre}', ${prod.precio}, ${prod.stock})">Editar</button>
                        <button class="btn-delete" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error al obtener inventario:', error);
    }
}

// Crear o Actualizar Producto
async function guardarProducto(e) {
    e.preventDefault();
    
    const id = document.getElementById('productoId').value;
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    const datos = { nombre, precio, stock };
    
    // Si hay un ID, editamos; si no, creamos uno nuevo
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            resetearFormulario();
            cargarProductos();
        } else {
            alert('Hubo un problema al guardar el producto.');
        }
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

// Cargar datos en el formulario para editar
function prepararEdicion(id, nombre, precio, stock) {
    document.getElementById('productoId').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;
    document.getElementById('stock').value = stock;

    document.getElementById('formTitle').innerText = 'Modificar Producto';
    document.getElementById('btnGuardar').innerText = 'Actualizar';
    document.getElementById('btnCancelar').style.display = 'inline-block';
}

// Eliminar un producto
async function eliminarProducto(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (respuesta.ok) {
            cargarProductos();
        } else {
            alert('Error al intentar eliminar.');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

// Limpiar formulario
function resetearFormulario() {
    document.getElementById('productoForm').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('formTitle').innerText = 'Agregar Nuevo Producto';
    document.getElementById('btnGuardar').innerText = 'Guardar Producto';
    document.getElementById('btnCancelar').style.display = 'none';
}

async function cargarFacturas() {
    const API_FACTURAS = '/api/facturas';
    try {
        const respuesta = await fetch(API_FACTURAS);
        const facturas = await respuesta.json();
        const tbody = document.getElementById('tablaFacturasAdmin');
        tbody.innerHTML = '';

        facturas.forEach(fac => {
            // Formatear la fecha para que sea legible
            const fechaFormateada = new Date(fac.fecha).toLocaleString('es-DO');
            
            tbody.innerHTML += `
                <tr>
                    <td>#${fac.id}</td>
                    <td>${fechaFormateada}</td>
                    <td><mark>${fac.empleado || 'Sistema'}</mark></td>
                    <td><strong>$${parseFloat(fac.total).toFixed(2)}</strong></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error al obtener el historial de facturas:', error);
    }
}