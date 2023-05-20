const mongoose = require('mongoose');

// Esquema de la colección Turno
const turnoSchema = new mongoose.Schema(
  {
    turno: String
  },
  { 
    collection: 'turnos' 
  }
);

module.exports = mongoose.model('Turno', turnoSchema);
