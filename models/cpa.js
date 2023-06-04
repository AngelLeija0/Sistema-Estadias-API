const mongoose = require('mongoose');

// Esquema de la colección CPA (Carta de Presentación Alumno)
const cpaSchema = new mongoose.Schema(
  {
    estado: String,
    fechaRegistro: String,
    idEstudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'estudiantes'
    },
    idPeriodo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'periodos'
    },
    telfonoCelular: String,
    telfonoCasa: String,
    nss: String,
    curp: String,
    nombreEmpresa: String,
    nombreEmpresario: String,
    puestoEmpresario: String,
    año: String,
  },
  { 
    collection: 'cpas' 
  }
);

module.exports = mongoose.model('CPA', cpaSchema);