const db = require('../config/db');

// 1. Registrar una nueva factura (Acceso: Empleado y Admin)
exports.crearFactura = async (req, res) => {
    const { total, usuario_id, productos } = req.body; 
    // 'productos' debe ser un array de objetos: [{ producto_id: 1, cantidad: 2, precio_unitario: 15.50 }]

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'La factura debe contener al menos un producto' });
    }

    // Usamos una conexión única para manejar la transacción de forma segura
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // A. Insertar la cabecera de la factura
        const [nuevaFactura] = await connection.query(
            'INSERT INTO facturas (total, usuario_id) VALUES (?, ?)', 
            [total, usuario_id || null]
        );
        const facturaId = nuevaFactura.insertId;

        // B. Recorrer los productos para validar stock, descontar e insertar detalles
        for (const item of productos) {
            // Verificar si hay stock suficiente
            const [prodCheck] = await connection.query('SELECT stock, nombre FROM productos WHERE id = ?', [item.producto_id]);
            if (prodCheck.length === 0) {
                throw new Error(`El producto con ID ${item.producto_id} no existe`);
            }
            
            const productoActual = prodCheck[0];
            if (productoActual.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto: ${productoActual.nombre}`);
            }

            // Restar del inventario
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?', 
                [item.cantidad, item.producto_id]
            );

            // Guardar el desglose de la factura
            await connection.query(
                'INSERT INTO detalles_factura (factura_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [facturaId, item.producto_id, item.cantidad, item.precio_unitario]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Factura procesada con éxito', facturaId });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message || 'Error al procesar la venta' });
    } finally {
        connection.release();
    }
};

// 2. Obtener todas las facturas (Acceso: Solo Admin)
exports.obtenerFacturas = async (req, res) => {
    try {
        const [facturas] = await db.query(`
            SELECT f.id, f.fecha, f.total, u.username AS empleado 
            FROM facturas f
            LEFT JOIN usuarios u ON f.usuario_id = u.id
            ORDER BY f.fecha DESC
        `);
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial de facturas' });
    }
};