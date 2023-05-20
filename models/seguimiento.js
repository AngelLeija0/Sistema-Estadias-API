const mongoose = require('mongoose');

// Esquema de la colección Seguimientos
const seguimientoSchema = new mongoose.Schema(
  {
    idAsesor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'asesores'
    },
    idEstudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'estudiantes'
    },
    emailEmpresario: String,
    telfEmpresario: String,
    proyecto: String,
    objetivo: String,
    descripcion: String,
    fechaRegistro: Date
  },
  { 
    collection: 'seguimientos' 
  }
);

module.exports = mongoose.model('Seguimiento', seguimientoSchema);