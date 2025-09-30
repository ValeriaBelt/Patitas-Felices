const express = require('express');
const cors = require('cors');
const pool = require('./base-datos/conexionSQL');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const resultado = await pool.request().query('SELECT GETDATE() AS fecha');
    res.send(`✅ Conexión exitosa. Fecha actual desde SQL Server: ${resultado.recordset[0].fecha}`);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    res.status(500).send('Error al conectar con la base de datos');
  }
});

// 👇 Aquí conectamos la ruta de donaciones
const donacionesRuta = require('./rutas/donacionesRuta');
app.use('/donaciones', donacionesRuta);

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});