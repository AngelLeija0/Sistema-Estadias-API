const mongoose = require('mongoose');

// Esquema de la colección Estudiantes
const estudianteSchema = new mongoose.Schema(
  {
    idCarrera: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carreras'
    },
    nombreEstudiante: String,
    apPaternoEstudiante: String,
    apMaternoEstudiante: String,
    emailEstudiante: String,
    passwordEstudiante: String,
    fechaRegistro: String
  },
  { 
    collection: 'estudiantes' 
  }
);

module.exports = mongoose.model('Estudiante', estudianteSchema);
