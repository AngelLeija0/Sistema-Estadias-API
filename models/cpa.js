const mongoose = require('mongoose');

// Esquema de la colección CPA (Carta de Presentación Alumno)
const cpaSchema = new mongoose.Schema(
  {
    idEstudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'estudiantes'
    },
    idGrado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'grados'
    },
    idGrupo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'grupos'
    },
    idPeriodo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'periodos'
    },
    idTurno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'turnos'
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