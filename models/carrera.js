const mongoose = require('mongoose');

// Esquema de la colección Carreras
const carreraSchema = new mongoose.Schema(
  {
    nombreCarrera: String,
    descripcionCarrera: String,
    directorCarrera: String,
    area: {
      nombreArea: Array,
      grado: Array, // 1ro, 2do, 3ro, 4to, 5to, 6to, 7mo, 8vo, 9no, 10mo, 11vo
      grupo: Array, // A, B, C
      turno: Array, // Matutino, vespertino
      nivel: Array // TSU, Ingenieria, Posgadro
    },
    fechaRegistro: String
  },
  {
    collection: 'carreras'
  }
);

module.exports = mongoose.model('Carrera', carreraSchema);