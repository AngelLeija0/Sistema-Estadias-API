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
    anteproyecto: {
      emailEmpresario: String,
      telfEmpresario: String,
      proyecto: String,
      objetivo: String,
      descripcion: String,
      estado: {
        name: String,
        motivo: String,
        fecha: Date
      },
    },
    avance: {
      idCPA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cpas'
      },
      etapa1: {
        nombre: String,
        fecha: Date,
      },
      etapa2: {
        nombre: String,
        fecha: Date,
      },
      etapa3: {
        nombre: String,
        fecha: Date,
      },
      etapa4: {
        nombre: String,
        fecha: Date,
      },
      etapa5: {
        nombre: String,
        fecha: Date,
      },
      progreso: Number
    },
    fechaRegistro: Date
  },
  { 
    collection: 'seguimientosAcademicos' 
  }
);

module.exports = mongoose.model('SeguimientoAcademico', seguimientoSchema);