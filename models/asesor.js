const mongoose = require('mongoose');

// Esquema de la colección Asesores
const asesorSchema = new mongoose.Schema(
  {
    idCarrera: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Carrera'
    },
    nombreAsesor: String,
    apPaternoAsesor: String,
    apMaternoAsesor: String,
    emailAsesor: String,
    telfAsesor: String,
    usernameAsesor: String,
    passwordAsesor: String
  },
  {
    collection: 'asesores'
  }
);

module.exports = mongoose.model('Asesor', asesorSchema);