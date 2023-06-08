const mongoose = require('mongoose')

// Esquema de la colección Alumnos
const estadiaSchema = new mongoose.Schema(
  {
    estadias: {
      idAlumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'alumnos'
      },
      cartaPresentacion: {
        estado: {
          nombre: String, // En revision, Aceptado, Rechazado
          motivo: String,
          fecha: Date
        },
        datosAlumno: {
          datosAlumno: {
            nombres: {
              nombre: String,
              apPaterno: String,
              apMaterno: String
            },
            privado: {
              matricula: String,
              email: String,
              password: String
            }
          },
          telfonoCelular: String,
          telfonoCasa: String,
          nss: String,
          curp: String
        },
        datosAcademicos: {
          datosAcademicosAlumno: {
            idCarrera: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'carreras'
            },
            grado: String,
            grupo: String
          },
          perido: String,
          año: String
        },
        datosEmpresa: {
          nombreEmpresa: String,
          nombreEmpresario: String,
          puestoEmpresario: String
        },
        fechaRegistro: Date // Fecha registro de Carta presentacion
      },
      anteproyecto: {
        datosEmpresa: {
          emailEmpresario: String,
          telfEmpresario: String
        },
        datosProyecto: {
          nombre: String,
          objetivo: String,
          descripcion: String
        },
        estado: {
          nombre: String,
          motivo: String,
          fecha: Date
        },
        fechaRegistro: Date // Fecha registro de Anteproyecto
      },
      avance: {
        etapa1: {
          nombre: String,
          fecha: Date
        },
        etapa2: {
          nombre: String,
          fecha: Date
        },
        etapa3: {
          nombre: String,
          fecha: Date
        },
        etapa4: {
          nombre: String,
          fecha: Date
        },
        etapa5: {
          nombre: String,
          fecha: Date
        },
        progreso: Number
      },
      documentos: {
        curriculum: {
          archivo: String,
          estado: {
            nombre: String,
            motivo: String,
            fecha: Date
          }
        },
        nss: {  // Numero seguro
          archivo: String,
          estado: {
            nombre: String,
            motivo: String,
            fecha: Date
          }
        },
        cpa: {  // Carta de presentacion alumno
          archivo: String,
          estado: {
            nombre: String,
            motivo: String,
            fecha: Date
          }
        },
        caa: {  // Carta Aceptacion
          archivo: String,
          estado: {
            nombre: String,
            motivo: String,
            fecha: Date
          }
        },
        reporte: {  // Reporte de proyecto
          archivo: String,
          estado: {
            nombre: String,
            motivo: String,
            fecha: Date
          }
        },
        rubrica: {  // Rubrica de evaluacion
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
        cta: {  // Carta terminacion
          archivo: String,
          estado: {
            nombre: String,
            motivo: String,
            fecha: Date
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
