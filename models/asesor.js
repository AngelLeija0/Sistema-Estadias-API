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
    datosAcademicos: {
      nivelAcademico: String,
      turno: String,
      carrera: String,
      area: String,
    },
    fechaRegistro: Date
  },
  {
    collection: 'asesores'
  }
)

module.exports = mongoose.model('Asesor', asesorSchema)
