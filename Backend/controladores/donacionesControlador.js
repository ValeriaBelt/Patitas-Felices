const pool = require('../base-datos/conexionSQL');
const enviarWhatsApp = require('../servicios/whatsapp');

const registrarDonacion = async (req, res) => {
  const { nombre, telefono, tipo, monto, descripcion } = req.body;

  try {
    await pool.request()
      .input('nombre', nombre)
      .input('telefono', telefono)
      .input('tipo', tipo)
      .input('monto', monto || null)
      .input('descripcion', descripcion || null)
      .query(`
        INSERT INTO donaciones (nombre, telefono, tipo, monto, descripcion)
        VALUES (@nombre, @telefono, @tipo, @monto, @descripcion)
      `);

    const mensaje = tipo === 'dinero'
      ? `Hola ${nombre}, gracias por tu donación de $${monto} a Patitas Felices 🐾. ¡Tu ayuda hace la diferencia!`
      : `Hola ${nombre}, gracias por tu aporte manual a Patitas Felices 🐾. ¡Tu ayuda hace la diferencia!`;

    await enviarWhatsApp(telefono, mensaje);

    res.status(201).json({ mensaje: 'Donación registrada y mensaje enviado por WhatsApp' });
  } catch (error) {
    console.error('❌ Error al registrar donación:', error);
    res.status(500).json({ mensaje: 'Error al registrar donación' });
  }
};

module.exports = { registrarDonacion };