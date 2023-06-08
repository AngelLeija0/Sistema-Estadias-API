const mongoose = require('mongoose')

// Esquema de la colección Asesores
const asesorSchema = new mongoose.Schema(
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
    collection: 'asesores'
  }
)

module.exports = mongoose.model('Asesor', asesorSchema)
