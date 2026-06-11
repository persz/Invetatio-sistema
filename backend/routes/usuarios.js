const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Definir la ruta POST para registrar
router.post('/registrar', usuarioController.registrarUsuario);

module.exports = router;