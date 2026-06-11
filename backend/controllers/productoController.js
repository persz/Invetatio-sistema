const db = require('../config/db');

// 1. Obtener todos los productos (Acceso: Admin y Empleado)
exports.obtenerProductos = async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// 2. Agregar un nuevo producto (Acceso: Solo Admin)
exports.crearProducto = async (req, res) => {
    const { nombre, precio, stock } = req.body;
    if (!nombre || !precio || stock === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        await db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', [nombre, precio, stock]);
        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

// 3. Modificar un producto existente (Acceso: Solo Admin)
exports.actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    try {
        await db.query('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [nombre, precio, stock, id]);
        res.json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// 4. Eliminar un producto (Acceso: Solo Admin)
exports.eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
        res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};