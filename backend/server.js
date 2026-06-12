// 1. Cargar variables de entorno al puro inicio
require('dotenv').config();

// 2. Importaciones de módulos de terceros
const express = require('express');
const cors = require('cors');
const path = require('path');

// 3. Importaciones de tus rutas locales
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const facturasRoutes = require('./routes/facturas');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// 4. Middlewares globales
app.use(cors());
app.use(express.json());

// 5. Conexión de los endpoints de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/usuarios', usuariosRoutes);

// 6. Servir archivos estáticos subiendo un nivel a la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirigir cualquier otra petición usando la nueva sintaxis obligatoria de parámetros
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 7. Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});