const mongoose = require('mongoose');

// Esquema de la colección Seguimientos
const seguimientoSchema = new mongoose.Schema(
    {
        curriculum: {
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        nss: {
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        cpa: { // Carta de presentacion
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        caa: { // Carta Aceptacion
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        reporte: { // Reporte de proyecto
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        rubrica: { // Rubrica de evaluacion
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        dictamen: {
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        protesta: { // Protesta de Ley
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        cta: { // Carta terminacion
            archivo: String,
            estado: {
                nombre: String,
                motivo: String,
                fecha: Date
            }
        },
        fechaRegistro: Date
    },
    {
        collection: 'seguimientosAdministrativos'
    }
);

module.exports = mongoose.model('SeguimientoAdministrativo', seguimientoSchema);