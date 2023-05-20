const mongoose = require('mongoose');

// Esquema de la colección Periodo
const periodoSchema = new mongoose.Schema(
  {
    periodo: String
  },
  { 
    collection: 'periodos' 
  }
);

module.exports = mongoose.model('Periodo', periodoSchema);