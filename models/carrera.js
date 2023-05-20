const mongoose = require('mongoose');

// Esquema de la colección Carreras
const carreraSchema = new mongoose.Schema(
  {
    nombreCarrera: String,
    descripcionCarrera: String,
    directorCarrera: String
  },
  {
    collection: 'asesores'
  }
);

module.exports = mongoose.model('Carrera', carreraSchema);