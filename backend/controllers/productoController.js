const db = require('../config/db');

// Obtener la lista de todos los productos (Admin y Empleado)
exports.obtenerProductos = async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Agregar un nuevo producto (Solo Admin)
exports.crearProducto = async (req, res) => {
    const { nombre, precio, stock } = req.body;
    
    // Validar que no falten datos (permitiendo que el stock inicial sea 0)
    if (!nombre || !precio || stock === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    try {
        // Consulta segura con placeholders contra inyección SQL
        await db.query(
            'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', 
            [nombre, precio, stock]
        );
        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

// Modificar datos de un producto (Solo Admin)
exports.actualizarProducto = async (req, res) => {
    const { id } = req.params; // ID capturado desde la URL
    const { nombre, precio, stock } = req.body;
    
    try {
        await db.query(
            'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', 
            [nombre, precio, stock, id]
        );
        res.json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto del inventario (Solo Admin)
exports.eliminarProducto = async (req, res) => {
    const { id } = req.params; // ID capturado desde la URL
    
    try {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
        res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};