const mongoose = require('mongoose');

// Esquema de la colección Grado
const gradoSchema = new mongoose.Schema(
  {
    grado: String
  },
  { 
    collection: 'grados' 
  }
);

module.exports = mongoose.model('Grado', gradoSchema);