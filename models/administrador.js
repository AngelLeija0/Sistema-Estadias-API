const mongoose = require('mongoose');

// Esquema de la colección Administrador
const administradorSchema = new mongoose.Schema(
  {
    nombreAdmin: String,
    emailAdmin: String,
    passwordAdmin: String
  },
  {
    collection: 'administradores'
  }
);

module.exports = mongoose.model('Administrador', administradorSchema);