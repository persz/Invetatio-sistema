const db = require('../config/db');

// Crear factura y actualizar stock (Admin y Empleado)
exports.crearFactura = async (req, res) => {
    const { total, usuario_id, productos } = req.body; 

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'La factura debe contener al menos un producto' });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Insertar cabecera de la factura
        const [nuevaFactura] = await connection.query(
            'INSERT INTO facturas (total, usuario_id) VALUES (?, ?)', 
            [total, usuario_id || null]
        );
        const facturaId = nuevaFactura.insertId;

        // 2. Procesar productos secuencialmente
        for (const item of productos) {
            
            // Validar existencia y stock del producto
            const [prodCheck] = await connection.query(
                'SELECT stock, nombre FROM productos WHERE id = ?', 
                [item.producto_id]
            );
            
            if (prodCheck.length === 0) {
                throw new Error(`El producto con ID ${item.producto_id} no existe`);
            }
            
            const productoActual = prodCheck[0];
            if (productoActual.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto: ${productoActual.nombre}`);
            }

            // Restar inventario
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?', 
                [item.cantidad, item.producto_id]
            );

            // Registrar detalle de la factura
            await connection.query(
                'INSERT INTO detalles_factura (factura_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [facturaId, item.producto_id, item.cantidad, item.precio_unitario]
            );
        }

        // Confirmar cambios si todo sale bien
        await connection.commit();
        res.status(201).json({ message: 'Factura procesada con éxito', facturaId });

    } catch (error) {
        // Deshacer cambios si ocurre un error
        await connection.rollback();
        res.status(500).json({ error: error.message || 'Error al procesar la venta' });
    } finally {
        // Liberar conexión devuelta al pool
        connection.release();
    }
};

// Obtener historial de facturas (Solo Admin)
exports.obtenerFacturas = async (req, res) => {
    try {
        // LEFT JOIN para mantener la factura aunque el usuario se elimine
        const [facturas] = await db.query(`
            SELECT f.id, f.fecha, f.total, u.username AS empleado 
            FROM facturas f
            LEFT JOIN usuarios u ON f.usuario_id = u.id
            ORDER BY f.fecha DESC
        `);
        res.json(facturas);
    } catch (error) {
        console.error('❌ Error al consultar facturas:', error);
        res.status(500).json({ error: 'Error al obtener el historial de facturas' });
    }
};