const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscamos al usuario por su nombre
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = rows[0];

        // Cambiamos la comparación directa por bcrypt.compare
        // user.contrasena es el hash de 60 caracteres guardado en la BD
        const coinciden = await bcrypt.compare(password, user.password); // <-- AGREGAR ESTA VALIDACIÓN

        if (!coinciden) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                username: user.username,
                rol: user.rol 
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { login };