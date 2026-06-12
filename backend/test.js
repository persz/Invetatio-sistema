const mysql = require('mysql2/promise');
require('dotenv').config();

async function iniciarBaseDeDatos() {
    console.log('🔄 Conectando a Aiven MySQL...');
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    console.log('✅ Conexión establecida.');

    // 1. Crear Tabla de Usuarios
    await connection.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            rol ENUM('admin', 'empleado') NOT NULL
        );
    `);

    // 2. Crear Tabla de Productos
    await connection.query(`
        CREATE TABLE IF NOT EXISTS productos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            stock INT NOT NULL
        );
    `);

    // 3. Crear Tabla de Facturas
    await connection.query(`
        CREATE TABLE IF NOT EXISTS facturas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            total DECIMAL(10, 2) NOT NULL,
            usuario_id INT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
    `);

    // 4. Crear Tabla de Detalles
    await connection.query(`
        CREATE TABLE IF NOT EXISTS detalles_factura (
            id INT AUTO_INCREMENT PRIMARY KEY,
            factura_id INT,
            producto_id INT,
            cantidad INT NOT NULL,
            precio_unitario DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        );
    `);

    console.log('📦 Tablas e infraestructura creadas en la nube.');

    // 5. Insertar datos de prueba
    await connection.query(`
        INSERT IGNORE INTO usuarios (id, username, password, rol) 
        VALUES (1, 'admin1', 'admin123', 'admin');
    `);

    await connection.query(`
        INSERT IGNORE INTO productos (id, nombre, precio, stock) 
        VALUES 
        (1, 'Laptop Lenovo LOQ', 850.00, 10),
        (2, 'Mouse Gamer RGB', 25.00, 50),
        (3, 'Teclado Mecánico', 60.00, 4);
    `);

    console.log('📥 Datos de prueba insertados con éxito.');

    // 6. Comprobación final: Leer los datos desde el servidor remoto
    console.log('\n🔍 Consultando datos reales en el servidor...');
    const [rows] = await connection.query('SELECT * FROM productos');
    
    console.log('\n=== INFORMACIÓN RECIBIDA DESDE TU SERVIDOR EN LA NUBE ===');
    console.table(rows);
    console.log('=========================================================\n');

    await connection.end();
    console.log('🔒 Conexión cerrada limpiamente.');
}

iniciarBaseDeDatos().catch(err => {
    console.error('❌ Hubo un error procesando la base de datos:', err);
});