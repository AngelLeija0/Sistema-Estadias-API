const mongoose = require('mongoose');

// Esquema de la colección Grupo
const grupoSchema = new mongoose.Schema(
  {
    grupo: String
  },
  { 
    collection: 'grupos' 
  }
);

module.exports = mongoose.model('Grupo', grupoSchema);