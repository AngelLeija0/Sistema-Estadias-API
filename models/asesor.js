const mongoose = require('mongoose');

// Esquema de la colección Asesores
const asesorSchema = new mongoose.Schema(
  {
    idCarrera: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carreras'
    },
    nombreAsesor: String,
    apPaternoAsesor: String,
    apMaternoAsesor: String,
    emailAsesor: String,
    telfAsesor: String,
    usernameAsesor: String,
    passwordAsesor: String,
    fechaRegistro: String
  },
  {
    collection: 'asesores'
  }
);

module.exports = mongoose.model('Asesor', asesorSchema);