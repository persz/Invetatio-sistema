// 1. Cargar variables de entorno al puro inicio
require('dotenv').config();

// 2. Importaciones de módulos de terceros
const express = require('express');
const cors = require('cors');
const path = require('path');

// 3. Importaciones de tus rutas locales
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const usuarioRoutes = require('./routes/usuarios'); // <-- 1. LE FALTABA ESTA IMPORTACIÓN

const app = express();

// 4. Middlewares globales
app.use(cors());
app.use(express.json());

// 5. Conexión de los endpoints de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/usuarios', usuarioRoutes); // <-- 2. LE FALTABA CONECTAR ESTE ENDPOINT

// 6. Ruta base de prueba para verificar que responda el servidor
app.get('/', (req, res) => {
    res.send('Servidor corriendo perfectamente 🚀');
});

// 7. Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});