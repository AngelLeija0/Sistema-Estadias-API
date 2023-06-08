const mongoose = require('mongoose');

// Esquema de la colección Carreras
const carreraSchema = new mongoose.Schema(
  {
    nombre: String,
    descripcion: String,
    director: String,
    area: {
      nombre: Array,
      turno: Array, // Matutino, vespertino
      nivel: Array // TSU, Ingenieria, Posgadro
    },
    fechaRegistro: Date
  },
  {
    collection: 'carreras'
  }
);

module.exports = mongoose.model('Carrera', carreraSchema);