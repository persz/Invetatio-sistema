const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { username, password } = req.body;

    console.log(`✉️ Intento de login recibido - Usuario: "${username}"`);

    try {
        // Buscar usuario por nombre
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        // Validar existencia del usuario
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const user = rows[0];

        // Comparar contraseña con el hash guardado
        const coinciden = await bcrypt.compare(password, user.password); 

        // Validar coincidencia de contraseña
        if (!coinciden) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Responder con los datos del perfil
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