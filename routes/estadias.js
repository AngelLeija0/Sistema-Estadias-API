const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();
const Estadia = require('../models/estadia');

// GET - Obtener todos las estadias
router.get('/', async (req, res) => {
  try {
    const estadias = await Estadia.find();
    res.json(estadias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear una nueva Carta Presentacion en Estadias
router.post('/:ruta', async (req, res) => {
  try {
    const ruta = req.params.ruta; // carta presentacion, anteproyecto, avance, documentos
    const objEstadia = {
      idAsesor: new ObjectId(req.body.idAsesor),
      idAlumno: new ObjectId(req.body.idAlumno),
      fechaRegistro: new Date(req.body.fechaRegistro)
    }

    if (ruta == "carta presentacion" && req.body.cartaPresentacion) {
      objEstadia.cartaPresentacion = {
        estado: {
          nombre: req.body.cartaPresentacion.estado.nombre,
          motivo: req.body.cartaPresentacion.estado.motivo,
          fecha: req.body.cartaPresentacion.estado.fecha
        },
        datosAlumno: {
          datosAlumno: {
            nombres: {
              nombre: req.body.cartaPresentacion.datosAlumno.datosAlumno.nombres.nombre,
              apPaterno: req.body.cartaPresentacion.datosAlumno.datosAlumno.nombres.apPaterno,
              apMaterno: req.body.cartaPresentacion.datosAlumno.datosAlumno.nombres.apMaterno
            },
            privado: {
              matricula: req.body.cartaPresentacion.datosAlumno.privado.matricula,
              email: req.body.cartaPresentacion.datosAlumno.privado.email,
              password: req.body.cartaPresentacion.datosAlumno.privado.password
            }
          },
          telefonoCelular: req.body.cartaPresentacion.telefonoCelular,
          telefonoCasa: req.body.cartaPresentacion.telefonoCasa,
          nss: req.body.cartaPresentacion.nss,
          curp: req.body.cartaPresentacion.curp
        },
        datosAcademicos: {
          datosAcademicosAlumno: {
            idCarrera: new ObjectId(req.body.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.idCarrera),
            grado: req.body.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grado,
            grupo: req.body.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grupo
          },
          periodo: req.body.cartaPresentacion.datosAcademicos.periodo,
          año: req.body.cartaPresentacion.datosAcademicos.año
        },
        datosEmpresa: {
          nombreEmpresa: req.body.cartaPresentacion.datosEmpresa.nombreEmpresa,
          nombreEmpresario: req.body.cartaPresentacion.datosEmpresa.nombreEmpresario,
          puestoEmpresario: req.body.cartaPresentacion.datosEmpresa.puestoEmpresario
        }
      }
    }

    if (ruta == "anteproyecto" && req.body.anteproyecto) {
      objEstadia.anteproyecto = {
        datosEmpresa: {
          emailEmpresario: req.body.anteproyecto.datosEmpresa.emailEmpresario,
          telefonoEmpresario: req.body.anteproyecto.datosEmpresa.telefonoEmpresario
        },
        datosProyecto: {
          nombre: req.body.anteproyecto.datosProyecto.nombre,
          objetivo: req.body.anteproyecto.datosProyecto.objetivo,
          descripcion: req.body.anteproyecto.datosProyecto.descripcion
        },
        estado: {
          nombre: req.body.anteproyecto.estado.nombre,
          motivo: req.body.anteproyecto.estado.motivo,
          fecha: req.body.anteproyecto.estado.fecha
        },
        fechaRegistro: req.body.anteproyecto.fechaRegistro
      }
    }

    if (ruta == "avance" && req.body.avance) {
      objEstadia.avance = {
        progreso: req.body.avance.progreso
      };
      if (req.body.avance.etapa1) {
        objEstadia.avance.etapa1 = {
          nombre: req.body.avance.etapa1.nombre,
          motivo: req.body.avance.etapa1.motivo,
          fecha: req.body.avance.etapa1.fecha
        }
      }
      if (req.body.avance.etapa2) {
        objEstadia.avance.etapa2 = {
          nombre: req.body.avance.etapa2.nombre,
          motivo: req.body.avance.etapa2.motivo,
          fecha: req.body.avance.etapa2.fecha,
        }
      }
      if (req.body.avance.etapa3) {
        objEstadia.avance.etapa3 = {
          nombre: req.body.avance.etapa3.nombre,
          motivo: req.body.avance.etapa3.motivo,
          fecha: req.body.avance.etapa3.fecha,
        }
      }
      if (req.body.avance.etapa4) {
        objEstadia.avance.etapa4 = {
          nombre: req.body.avance.etapa4.nombre,
          motivo: req.body.avance.etapa4.motivo,
          fecha: req.body.avance.etapa4.fecha,
        }
      }
      if (req.body.avance.etapa5) {
        objEstadia.avance.etapa5 = {
          nombre: req.body.avance.etapa5.nombre,
          motivo: req.body.avance.etapa5.motivo,
          fecha: req.body.avance.etapa5.fecha,
        }
      }
    }
    
    if (ruta == "documentos" && req.body.documentos) {
      objEstadia.documentos = {};
      if (req.body.documentos.curriculum) {
        objEstadia.documentos.curriculum = {
          archivo: req.body.documentos.curriculum,
          estado: {
            nombre: req.body.documentos.curriculum.estado.nombre,
            motivo: req.body.documentos.curriculum.estado.motivo,
            fecha: req.body.documentos.curriculum.estado.fecha,
          }
        }
      }
      if (req.body.documentos.nss) {
        objEstadia.documentos.nss = {
          archivo: req.body.documentos.nss,
          estado: {
            nombre: req.body.documentos.nss.estado.nombre,
            motivo: req.body.documentos.nss.estado.motivo,
            fecha: req.body.documentos.nss.estado.fecha,
          }
        }
      }
      if (req.body.documentos.cpa) {  // Carta presentacion
        objEstadia.documentos.cpa = {
          archivo: req.body.documentos.cpa,
          estado: {
            nombre: req.body.documentos.cpa.estado.nombre,
            motivo: req.body.documentos.cpa.estado.motivo,
            fecha: req.body.documentos.cpa.estado.fecha,
          }
        }
      }
      if (req.body.documentos.caa) { // Carta aceptacion
        objEstadia.documentos.caa = {
          archivo: req.body.documentos.caa,
          estado: {
            nombre: req.body.documentos.caa.estado.nombre,
            motivo: req.body.documentos.caa.estado.motivo,
            fecha: req.body.documentos.caa.estado.fecha,
          }
        }
      }
      if (req.body.documentos.reporte) {
        objEstadia.documentos.reporte = {
          archivo: req.body.documentos.reporte,
          estado: {
            nombre: req.body.documentos.reporte.estado.nombre,
            motivo: req.body.documentos.reporte.estado.motivo,
            fecha: req.body.documentos.reporte.estado.fecha,
          }
        }
      }
      if (req.body.documentos.rubrica) {
        objEstadia.documentos.rubrica = {
          archivo: req.body.documentos.rubrica,
          estado: {
            nombre: req.body.documentos.rubrica.estado.nombre,
            motivo: req.body.documentos.rubrica.estado.motivo,
            fecha: req.body.documentos.rubrica.estado.fecha,
          }
        }
      }
      if (req.body.documentos.dictamen) {
        objEstadia.documentos.dictamen = {
          archivo: req.body.documentos.dictamen,
          estado: {
            nombre: req.body.documentos.dictamen.estado.nombre,
            motivo: req.body.documentos.dictamen.estado.motivo,
            fecha: req.body.documentos.dictamen.estado.fecha,
          }
        }
      }
      if (req.body.documentos.protesta) {
        objEstadia.documentos.protesta = {
          archivo: req.body.documentos.protesta,
          estado: {
            nombre: req.body.documentos.protesta.estado.nombre,
            motivo: req.body.documentos.protesta.estado.motivo,
            fecha: req.body.documentos.protesta.estado.fecha,
          }
        }
      }
      if (req.body.documentos.cta) {  // Carta terminacion
        objEstadia.documentos.cta = {
          archivo: req.body.documentos.cta,
          estado: {
            nombre: req.body.documentos.cta.estado.nombre,
            motivo: req.body.documentos.cta.estado.motivo,
            fecha: req.body.documentos.cta.estado.fecha,
          }
        }
      }
    }
    const estadia = new Estadia(objEstadia);
    const newEstadia = await Estadia.save();
    res.status(201).json(newEstadia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar una estadia por su ID
router.patch('/:id/:ruta', async (req, res) => {
  try {
    const ruta = req.params.ruta; // carta presentacion, anteproyecto, avance, documentos
    const estadia = await Estadia.findById(req.params.id);

    if (ruta === "carta presentacion" && req.body.cartaPresentacion) {
      const cartaPresentacion = req.body.cartaPresentacion;

      estadia.cartaPresentacion.estado.nombre = cartaPresentacion.estado.nombre || estadia.cartaPresentacion.estado.nombre;
      estadia.cartaPresentacion.estado.motivo = cartaPresentacion.estado.motivo || estadia.cartaPresentacion.estado.motivo;
      estadia.cartaPresentacion.estado.fecha = cartaPresentacion.estado.fecha || estadia.cartaPresentacion.estado.fecha;

      const datosAlumno = cartaPresentacion.datosAlumno;
      const datosAlumnoAlumno = datosAlumno.datosAlumno;
      const nombres = datosAlumnoAlumno.nombres;
      estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.nombre = nombres.nombre || estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.nombre;
      estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apPaterno = nombres.apPaterno || estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apPaterno;
      estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apMaterno = nombres.apMaterno || estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apMaterno;

      const privado = datosAlumnoAlumno.privado;
      estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.matricula = privado.matricula || estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.matricula;
      estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.email = privado.email || estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.email;
      estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.password = privado.password || estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.password;

      estadia.cartaPresentacion.telefonoCelular = datosAlumno.telefonoCelular || estadia.cartaPresentacion.telefonoCelular;
      estadia.cartaPresentacion.telefonoCasa = datosAlumno.telefonoCasa || estadia.cartaPresentacion.telefonoCasa;
      estadia.cartaPresentacion.nss = datosAlumno.nss || estadia.cartaPresentacion.nss;
      estadia.cartaPresentacion.curp = datosAlumno.curp || estadia.cartaPresentacion.curp;

      const datosAcademicos = cartaPresentacion.datosAcademicos;
      const datosAcademicosAlumno = datosAcademicos.datosAcademicosAlumno;
      estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.idCarrera = datosAcademicosAlumno.idCarrera || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.idCarrera;
      estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grado = datosAcademicosAlumno.grado || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grado;
      estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grupo = datosAcademicosAlumno.grupo || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grupo;

      estadia.cartaPresentacion.datosAcademicos.periodo = datosAcademicos.periodo || estadia.cartaPresentacion.datosAcademicos.periodo;
      estadia.cartaPresentacion.datosAcademicos.año = datosAcademicos.año || estadia.cartaPresentacion.datosAcademicos.año;

      const datosEmpresa = cartaPresentacion.datosEmpresa;
      estadia.cartaPresentacion.datosEmpresa.nombreEmpresa = datosEmpresa.nombreEmpresa || estadia.cartaPresentacion.datosEmpresa.nombreEmpresa;
      estadia.cartaPresentacion.datosEmpresa.nombreEmpresario = datosEmpresa.nombreEmpresario || estadia.cartaPresentacion.datosEmpresa.nombreEmpresario;
      estadia.cartaPresentacion.datosEmpresa.puestoEmpresario = datosEmpresa.puestoEmpresario || estadia.cartaPresentacion.datosEmpresa.puestoEmpresario;
    }

    if (ruta === "anteproyecto" && req.body.anteproyecto) {
      const anteproyecto = req.body.anteproyecto;

      const datosEmpresa = anteproyecto.datosEmpresa;
      estadia.anteproyecto.datosEmpresa.emailEmpresario = datosEmpresa.emailEmpresario || estadia.anteproyecto.datosEmpresa.emailEmpresario;
      estadia.anteproyecto.datosEmpresa.telefonoEmpresario = datosEmpresa.telefonoEmpresario || estadia.anteproyecto.datosEmpresa.telefonoEmpresario;

      const datosProyecto = anteproyecto.datosProyecto;
      estadia.anteproyecto.datosProyecto.nombre = datosProyecto.nombre || estadia.anteproyecto.datosProyecto.nombre;
      estadia.anteproyecto.datosProyecto.objetivo = datosProyecto.objetivo || estadia.anteproyecto.datosProyecto.objetivo;
      estadia.anteproyecto.datosProyecto.descripcion = datosProyecto.descripcion || estadia.anteproyecto.datosProyecto.descripcion;

      estadia.anteproyecto.estado.nombre = anteproyecto.estado.nombre || estadia.anteproyecto.estado.nombre;
      estadia.anteproyecto.estado.motivo = anteproyecto.estado.motivo || estadia.anteproyecto.estado.motivo;
      estadia.anteproyecto.estado.fecha = anteproyecto.estado.fecha || estadia.anteproyecto.estado.fecha;

      estadia.anteproyecto.fechaRegistro = anteproyecto.fechaRegistro || estadia.anteproyecto.fechaRegistro;
    }

    if (ruta === "avance" && req.body.avance) {
      const avance = req.body.avance;
      estadia.avance.progreso = avance.progreso || estadia.avance.progreso;

      if (avance.etapa1) {
        const etapa1 = avance.etapa1;
        estadia.avance.etapa1.nombre = etapa1.nombre || estadia.avance.etapa1.nombre;
        estadia.avance.etapa1.motivo = etapa1.motivo || estadia.avance.etapa1.motivo;
        estadia.avance.etapa1.fecha = etapa1.fecha || estadia.avance.etapa1.fecha;
      }

      if (avance.etapa2) {
        const etapa2 = avance.etapa2;
        estadia.avance.etapa2.nombre = etapa2.nombre || estadia.avance.etapa2.nombre;
        estadia.avance.etapa2.motivo = etapa2.motivo || estadia.avance.etapa2.motivo;
        estadia.avance.etapa2.fecha = etapa2.fecha || estadia.avance.etapa2.fecha;
      }

      if (avance.etapa3) {
        const etapa3 = avance.etapa3;
        estadia.avance.etapa3.nombre = etapa3.nombre || estadia.avance.etapa3.nombre;
        estadia.avance.etapa3.motivo = etapa3.motivo || estadia.avance.etapa3.motivo;
        estadia.avance.etapa3.fecha = etapa3.fecha || estadia.avance.etapa3.fecha;
      }

      if (avance.etapa4) {
        const etapa4 = avance.etapa4;
        estadia.avance.etapa4.nombre = etapa4.nombre || estadia.avance.etapa4.nombre;
        estadia.avance.etapa4.motivo = etapa4.motivo || estadia.avance.etapa4.motivo;
        estadia.avance.etapa4.fecha = etapa4.fecha || estadia.avance.etapa4.fecha;
      }

      if (avance.etapa5) {
        const etapa5 = avance.etapa5;
        estadia.avance.etapa5.nombre = etapa5.nombre || estadia.avance.etapa5.nombre;
        estadia.avance.etapa5.motivo = etapa5.motivo || estadia.avance.etapa5.motivo;
        estadia.avance.etapa5.fecha = etapa5.fecha || estadia.avance.etapa5.fecha;
      }
    }

    if (ruta === "documentos" && req.body.documentos) {
      const documentos = req.body.documentos;

      if (documentos.curriculum) {
        const curriculum = documentos.curriculum;
        estadia.documentos.curriculum.archivo = curriculum.archivo || estadia.documentos.curriculum.archivo;
        estadia.documentos.curriculum.estado.nombre = curriculum.estado.nombre || estadia.documentos.curriculum.estado.nombre;
        estadia.documentos.curriculum.estado.motivo = curriculum.estado.motivo || estadia.documentos.curriculum.estado.motivo;
        estadia.documentos.curriculum.estado.fecha = curriculum.estado.fecha || estadia.documentos.curriculum.estado.fecha;
      }

      if (documentos.nss) {
        const nss = documentos.nss;
        estadia.documentos.nss.archivo = nss.archivo || estadia.documentos.nss.archivo;
        estadia.documentos.nss.estado.nombre = nss.estado.nombre || estadia.documentos.nss.estado.nombre;
        estadia.documentos.nss.estado.motivo = nss.estado.motivo || estadia.documentos.nss.estado.motivo;
        estadia.documentos.nss.estado.fecha = nss.estado.fecha || estadia.documentos.nss.estado.fecha;
      }

      if (documentos.cartasRecomendacion) {
        const cartasRecomendacion = documentos.cartasRecomendacion;
        estadia.documentos.cartasRecomendacion.cantidad = cartasRecomendacion.cantidad || estadia.documentos.cartasRecomendacion.cantidad;
        estadia.documentos.cartasRecomendacion.estado.nombre = cartasRecomendacion.estado.nombre || estadia.documentos.cartasRecomendacion.estado.nombre;
        estadia.documentos.cartasRecomendacion.estado.motivo = cartasRecomendacion.estado.motivo || estadia.documentos.cartasRecomendacion.estado.motivo;
        estadia.documentos.cartasRecomendacion.estado.fecha = cartasRecomendacion.estado.fecha || estadia.documentos.cartasRecomendacion.estado.fecha;
      }

      if (documentos.constanciaEstudios) {
        const constanciaEstudios = documentos.constanciaEstudios;
        estadia.documentos.constanciaEstudios.archivo = constanciaEstudios.archivo || estadia.documentos.constanciaEstudios.archivo;
        estadia.documentos.constanciaEstudios.estado.nombre = constanciaEstudios.estado.nombre || estadia.documentos.constanciaEstudios.estado.nombre;
        estadia.documentos.constanciaEstudios.estado.motivo = constanciaEstudios.estado.motivo || estadia.documentos.constanciaEstudios.estado.motivo;
        estadia.documentos.constanciaEstudios.estado.fecha = constanciaEstudios.estado.fecha || estadia.documentos.constanciaEstudios.estado.fecha;
      }
    }

    const updatedEstadia = await estadia.save();
    res.json(updatedEstadia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE - Eliminar una estadia por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Alumno.findByIdAndDelete(req.params.id);
    res.json({ message: 'alumno eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;