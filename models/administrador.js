const mongoose = require('mongoose')

// Esquema de la colección Administrador
const administradorSchema = new mongoose.Schema(
  {
    datosPersonales: {
      nombres: {
        nombre: String,
        apPaterno: String,
        apMaterno: String
      },
      privado: {
        email: String,
        telfono: String,
        username: String,
        password: String
      }
    },
    fechaRegistro: String
  },
  {
    collection: 'administradores'
  }
)

module.exports = mongoose.model('Administrador', administradorSchema)
