const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs'); // Usa la librería de tu backend
require('dotenv').config();

async function actualizarContrasenas() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        console.log("⚡ Generando hashes reales con bcryptjs...");
        
        // Generamos los hashes perfectos en tiempo de ejecución
        const salt = await bcrypt.genSalt(10);
        const hashAdmin = await bcrypt.hash('admin123', salt);
        const hashEmpleado = await bcrypt.hash('emp123', salt);

        console.log("☁️ Conectando a Aiven para actualizar la base de datos...");

        // 1. Actualizar admin1
        await connection.query(
            'UPDATE usuarios SET password = ? WHERE username = ?',
            [hashAdmin, 'admin1']
        );
        console.log("✅ Contraseña de 'admin1' actualizada con su hash real.");

        // 2. Actualizar empleado1
        await connection.query(
            'UPDATE usuarios SET password = ? WHERE username = ?',
            [hashEmpleado, 'empleado1']
        );
        console.log("✅ Contraseña de 'empleado1' actualizada con su hash real.");

        await connection.end();
        console.log("🔒 Proceso terminado con éxito. ¡Todo sincronizado!");
    } catch (error) {
        console.error("❌ Error durante la actualización:", error);
    }
}

actualizarContrasenas();