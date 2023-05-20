const mongoose = require('mongoose');

// Esquema de la colección Estudiantes
const estudianteSchema = new mongoose.Schema(
  {
    idArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'areas'
    },
    nombreEstudiante: String,
    apPaternoEstudiante: String,
    apMaternoEstudiante: String,
    emailEstudiante: String,
    passwordEstudiante: String
  },
  { 
    collection: 'estudiantes' 
  }
);

module.exports = mongoose.model('Estudiante', estudianteSchema);
