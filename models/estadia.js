const mongoose = require('mongoose')

// Esquema de la colección Estadias
const estadiaSchema = new mongoose.Schema(
  {
    idAsesor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'asesores',
      default: null,
      required: false
    },
    idAlumno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'alumnos'
    },
    cartaPresentacion: {
      type: Object,
      default: null,
      required: false
    },
    anteproyecto: {
      type: Object,
      default: null,
      required: false
    },
    documentos: {
      type: Object,
      default: null,
      required: false
    }
  },
  {
    collection: 'estadias'
  }
)

module.exports = mongoose.model('Estadia', estadiaSchema)


/*

const mongoose = require('mongoose')

// Esquema de la colección Estadias
const estadiaSchema = new mongoose.Schema(
  {
    estadias: {
      idAsesor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'asesores'
      },
      idAlumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'alumnos'
      },
      cartaPresentacion: {
        estado: {
          nombre: { type: String, default: null }, // En revision, Aceptado, Rechazado
          motivo: { type: String, default: null },
          fecha: { type: Date, default: null }
        },
        datosAlumno: {
          datosAlumno: {
            nombres: {
              nombre: { type: String, default: null },
              apPaterno: { type: String, default: null },
              apMaterno: { type: String, default: null }
            },
            privado: {
              matricula: { type: String, default: null },
              email: { type: String, default: null },
              password: { type: String, default: null }
            }
          },
          telfonoCelular: { type: String, default: null },
          telfonoCasa: { type: String, default: null },
          nss: { type: String, default: null },
          curp: { type: String, default: null }
        },
        datosAcademicos: {
          datosAcademicosAlumno: {
            idCarrera: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'carreras',
              default: null
            },
            grado: { type: String, default: null },
            grupo: { type: String, default: null }
          },
          perido: { type: String, default: null },
          año: { type: String, default: null }
        },
        datosEmpresa: {
          nombreEmpresa: { type: String, default: null },
          nombreEmpresario: { type: String, default: null },
          puestoEmpresario: { type: String, default: null }
        },
        fechaRegistro: { type: Date, default: null } // Fecha registro de Carta presentacion
      },
      anteproyecto: {
        type: {
          datosEmpresa: {
            nombreEmpresario: { type: String, default: null },
            emailEmpresario: { type: String, default: null },
            telfEmpresario: { type: String, default: null }
          },
          datosProyecto: {
            nombre: { type: String, default: null },
            objetivo: { type: String, default: null },
            descripcion: { type: String, default: null }
          },
          estado: {
            nombre: { type: String, default: null }, // En revision, Aceptada, Rechazada
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          },
          fechaRegistro: { type: Date, default: null } // Fecha registro de Anteproyecto
        },
        default: null
      },
      avance: {
        etapa1: { // Anteproyecto
          nombre: { type: String, default: null }, // En revision, Aceptada, Rechazada
          motivo: { type: String, default: null },
          fecha: { type: Date, default: null }
        },
        etapa2: { // 25%
          nombre: { type: String, default: null },
          motivo: { type: String, default: null },
          fecha: { type: Date, default: null }
        },
        etapa3: { // 50%
          nombre: { type: String, default: null },
          motivo: { type: String, default: null },
          fecha: { type: Date, default: null }
        },
        etapa4: { // 75%
          nombre: { type: String, default: null },
          motivo: { type: String, default: null },
          fecha: { type: Date, default: null }
        },
        etapa5: { // 100%
          nombre: { type: String, default: null },
          motivo: { type: String, default: null },
          fecha: { type: Date, default: null }
        },
        progreso: { type: Number, default: null }
      },
      documentos: {
        curriculum: {
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        nss: {  // Numero seguro
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        cpa: {  // Carta de presentacion alumno
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        caa: {  // Carta Aceptacion
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        reporte: {  // Reporte de proyecto
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        rubrica: {  // Rubrica de evaluacion
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        dictamen: {
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        protesta: { // Protesta de Ley
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        },
        cta: {  // Carta terminacion
          archivo: { type: String, default: null },
          estado: {
            nombre: { type: String, default: null },
            motivo: { type: String, default: null },
            fecha: { type: Date, default: null }
          }
        }
      }
    }
  },
  {
    collection: 'estadias'
  }
)

module.exports = mongoose.model('Estadia', estadiaSchema)


*/