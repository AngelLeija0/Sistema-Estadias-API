const mongoose = require('mongoose');

// Esquema de la colección Carreras
const carreraSchema = new mongoose.Schema(
  {
    nombreCarrera: String,
    descripcionCarrera: String,
    directorCarrera: String
  },
  {
    collection: 'carreras'
  }
);

module.exports = mongoose.model('Carrera', carreraSchema);