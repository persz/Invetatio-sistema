const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { username, password } = req.body;

    // 👇 Esto nos dirá en la terminal si el frontend está enviando los datos correctamente
    console.log(`✉️ Intento de login recibido - Usuario: "${username}"`);

    try {
        // Buscamos al usuario por su nombre
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        if (rows.length === 0) {
            // Ajustado a 'error' para que auth.js muestre el mensaje real en la pantalla
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const user = rows[0];

        // Comparamos el hash de la base de datos con la clave que viene del formulario
        const coinciden = await bcrypt.compare(password, user.password); 

        if (!coinciden) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // 👇 ¡AJUSTE CLAVE! Enviamos los datos en la raíz para que tu auth.js los lea perfectamente
        res.json({
            id: user.id,
            username: user.username,
            rol: user.rol 
        });

    } catch (error) {
        console.error('❌ Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { login };