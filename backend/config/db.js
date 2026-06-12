const mysql = require('mysql2/promise');

// Pool de conexiones para optimizar consultas simultáneas
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,  // Espera conexión si el pool está lleno
    connectionLimit: 10,       // Conexiones máximas en paralelo
    queueLimit: 0              // Sin límite de espera en cola
});

module.exports = pool;