const mongoose = require('mongoose');

// Esquema de la colección CPA (Carta de Presentación Alumno)
const cpaSchema = new mongoose.Schema(
  {
    idEstudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Estudiante'
    },
    idGrado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grado'
    },
    idGrupo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grupo'
    },
    idPeriodo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Periodo'
    },
    idTurno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turno'
    },
    telefono: String,
    nss: String,
    curp: String,
    nombreEmpresa: String,
    nombreEmpresario: String,
    puestoEmpresario: String
  },
  { 
    collection: 'cpas' 
  }
);

module.exports = mongoose.model('CPA', cpaSchema);