const mongoose = require('mongoose');

// Esquema de la colección Avances
const avanceSchema = new mongoose.Schema(
  {
    idCPA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CPA'
    },
    etapa1: String,
    etapa1Fecha: Date,
    etapa2: String,
    etapa2Fecha: Date,
    etapa3: String,
    etapa3Fecha: Date,
    etapa4: String,
    etapa4Fecha: Date,
    etapa5: String,
    etapa5Fecha: Date,
    progreso: Number
  },
  {
    collection: 'avances'
  }
);

module.exports = mongoose.model('Avance', avanceSchema);