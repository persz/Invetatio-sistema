const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const registrarUsuario = async (req, res) => {
    const { usuario, contrasena, rol } = req.body;

    // Validaciones básicas de entrada
    if (!usuario || !contrasena || !rol) {
        return res.status(404).json({ message: 'Todos los campos son obligatorios (usuario, contrasena, rol)' });
    }

    // Validar que el rol sea uno de los permitidos en tu sistema
    if (rol !== 'admin' && rol !== 'empleado') {
        return res.status(400).json({ message: 'El rol debe ser \"admin\" o \"empleado\"' });
    }

    try {
        // 1. Verificar si el usuario ya existe en la base de datos
        const [usuarioExiste] = await pool.query('SELECT id FROM usuarios WHERE usuario = ?', [usuario]);
        
        if (usuarioExiste.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // 2. Encriptar la contraseña de forma segura
        const saltRounds = 10;
        const contrasenaEncriptada = await bcrypt.hash(contrasena, saltRounds);

        // 3. Insertar el nuevo usuario en la base de datos
        await pool.query(
            'INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)',
            [usuario, contrasenaEncriptada, rol]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente ✨' });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el usuario' });
    }
};

module.exports = { registrarUsuario };