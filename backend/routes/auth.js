const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta POST para procesar el inicio de sesión
router.post('/login', authController.login);

// Exportar el enrutador para conectarlo en el archivo principal (server.js)
module.exports = router;