const mongoose = require('mongoose')

// Esquema de la colección Alumnos
const alumnoSchema = new mongoose.Schema(
  {
    datosPersonales: {
      nombres: {
        nombre: String,
        apPaterno: String,
        apMaterno: String
      },
      privado: {
        matricula: String,
        email: String,
        password: String
      }
    },
    datosAcademicos: {
      nivelAcademico: String, // TSU, Ingenieria, Posgrado
      turno: String,
      carrera: String,
      area: String,
      grado: String,
      grupo: String
    },
    fechaRegistro: Date
  },
  {
    collection: 'alumnos'
  }
)

module.exports = mongoose.model('Alumno', alumnoSchema)
