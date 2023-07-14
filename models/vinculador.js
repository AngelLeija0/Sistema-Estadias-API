const mongoose = require('mongoose')

// Esquema de la colección Vinculacion
const vinculadorSchema = new mongoose.Schema(
  {
    datosPersonales: {
      nombres: {
        nombre: String,
        apPaterno: String,
        apMaterno: String
      },
      privado: {
        email: String,
        username: String,
        password: String
      }
    },
    fechaRegistro: Date
  },
  {
    collection: 'vinculacion'
  }
)

module.exports = mongoose.model('Vinculador', vinculadorSchema)
