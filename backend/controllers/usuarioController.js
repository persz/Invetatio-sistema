const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Registrar nuevos usuarios (Solo Admin)
const registrarUsuario = async (req, res) => {
    const { username, password, rol } = req.body;

    // Validar que no falten datos
    if (!username || !password || !rol) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios (username, password, rol)' });
    }

    // Validar que el rol sea permitido
    if (rol !== 'admin' && rol !== 'empleado') {
        return res.status(400).json({ error: 'El rol debe ser "admin" o "empleado"' });
    }

    try {
        // 1. Evitar nombres de usuario duplicados
        const [usuarioExiste] = await pool.query('SELECT id FROM usuarios WHERE username = ?', [username]);
        
        if (usuarioExiste.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // 2. Encriptar la contraseña de forma segura
        const saltRounds = 10;
        const contrasenaEncriptada = await bcrypt.hash(password, saltRounds);

        // 3. Guardar el nuevo usuario con su clave encriptada
        await pool.query(
            'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
            [username, contrasenaEncriptada, rol]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente ✨' });

    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear el usuario' });
    }
};

module.exports = { registrarUsuario };