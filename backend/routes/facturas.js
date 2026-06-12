const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

// Ruta para crear una nueva factura (registrar venta)
router.post('/', facturaController.crearFactura);

// Ruta para obtener el historial completo de facturas
router.get('/', facturaController.obtenerFacturas);

module.exports = router;