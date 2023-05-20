const mongoose = require('mongoose');

// Esquema de la colección Avances
const areaSchema = new mongoose.Schema(
  {
    idArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carreras'
    },
    nombreArea: String,
  },
  {
    collection: 'areas'
  }
);

module.exports = mongoose.model('Area', areaSchema);