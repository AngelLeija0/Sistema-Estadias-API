const express = require('express');
const router = express.Router();
const Seguimiento = require('../models/seguimientoAcademico');

// GET - Obtener todos los seguimientos
router.get('/', async (req, res) => {
  try {
    const seguimientos = await Seguimiento.find();
    res.json(seguimientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener seguimiento por id
router.get('/id/:id', async (req, res) => {
  try {
    const seguimiento = await Seguimiento.findById(req.params.id);
    res.json(seguimiento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener seguimiento por dato
router.get('/:data', async (req, res) => {
  try {
    const schemaProperties = Object.keys(Seguimiento.schema.obj);

    for (const properties of schemaProperties) {
      const filter = {};
      filter[properties] = req.params.data;
      const seguimiento = await Seguimiento.findOne(filter);
      if (seguimiento !== null) {
        return res.json(seguimiento)
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo seguimiento
router.post('/', async (req, res) => {
  try {
    const seguimiento = new Seguimiento({
      idAsesor: req.body.idAsesor,
      idEstudiante: req.body.idEstudiante,
      fechaRegistro: req.body.fechaRegistro
    });
    // Verificar request
    if (req.body.anteproyecto) {
      seguimiento.anteproyecto = {
        emailEmpresario: req.body.anteproyecto.emailEmpresario,
        telfEmpresario: req.body.anteproyecto.telfEmpresario,
        proyecto: req.body.anteproyecto.proyecto,
        objetivo: req.body.anteproyecto.objetivo,
        descripcion: req.body.anteproyecto.descripcion,
        estado: {
          name: req.body.anteproyecto.estado.name,
          motivo: req.body.anteproyecto.estado.motivo,
          fecha: req.body.anteproyecto.estado.fecha
        },
      }
    }
    if (req.body.avance) {
      seguimiento.avance = {
        idCPA: req.body.avance.idCPA,
        etapa1: {
          nombre: req.body.etapa1.nombre,
          fecha: req.body.etapa1.fecha
        },
        progreso: req.body.avance.progreso
      }
    }
    const newSeguimiento = await seguimiento.save();
    res.status(201).json(newSeguimiento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un seguimiento por su ID
router.patch('/:id', async (req, res) => {
  try {
    const seguimiento = await Seguimiento.findById(req.params.id);
    // Asesor y estudiante
    seguimiento.idAsesor = req.body.idAsesor || seguimiento.idAsesor;
    seguimiento.idEstudiante = req.body.idEstudiante || seguimiento.idEstudiante;
    //Anteproyecto
    seguimiento.anteproyecto.emailEmpresario = req.body.anteproyecto.emailEmpresario || seguimiento.anteproyecto.emailEmpresario;
    seguimiento.anteproyecto.telfEmpresario = req.body.anteproyecto.telfEmpresario || seguimiento.anteproyecto.telfEmpresario;
    seguimiento.anteproyecto.proyecto = req.body.anteproyecto.proyecto || seguimiento.anteproyecto.proyecto;
    seguimiento.anteproyecto.objetivo = req.body.anteproyecto.objetivo || seguimiento.anteproyecto.objetivo;
    seguimiento.anteproyecto.descripcion = req.body.anteproyecto.descripcion || seguimiento.anteproyecto.descripcion;
    seguimiento.anteproyecto.estado.name = req.body.anteproyecto.estado.name || seguimiento.anteproyecto.estado.name;
    seguimiento.anteproyecto.estado.motivo = req.body.anteproyecto.estado.motivo || seguimiento.anteproyecto.estado.motivo;
    seguimiento.anteproyecto.estado.fecha = req.body.anteproyecto.estado.fecha || seguimiento.anteproyecto.estado.fecha;
    //Avance
    seguimiento.avance.idCPA = req.body.seguimiento.idCPA || seguimiento.avance.idCPA;
    seguimiento.avance.etapa1.nombre = req.body.avance.etapa1.nombre || seguimiento.avance.etapa1.nombre;
    seguimiento.avance.etapa1.fecha = req.body.avance.etapa1.fecha || seguimiento.avance.etapa1.fecha;
    seguimiento.avance.etapa2.nombre = req.body.avance.etapa2.nombre || seguimiento.avance.etapa2.nombre;
    seguimiento.avance.etapa2.fecha = req.body.avance.etapa2.fecha || seguimiento.avance.etapa2.fecha;
    seguimiento.avance.etapa3.nombre = req.body.avance.etapa3.nombre || seguimiento.avance.etapa3.nombre;
    seguimiento.avance.etapa3.fecha = req.body.avance.etapa3.fecha || seguimiento.avance.etapa3.fecha;
    seguimiento.avance.etapa4.nombre = req.body.avance.etapa4.nombre || seguimiento.avance.etapa4.nombre;
    seguimiento.avance.etapa4.fecha = req.body.avance.etapa4.fecha || seguimiento.avance.etapa4.fecha;
    seguimiento.avance.etapa5.nombre = req.body.avance.etapa5.nombre || seguimiento.avance.etapa5.nombre;
    seguimiento.avance.etapa5.fecha = req.body.avance.etapa5.fecha || seguimiento.avance.etapa5.fecha;
    // Fecha
    seguimiento.fechaRegistro = req.body.fechaRegistro || seguimiento.fechaRegistro;
    const updatedSeguimiento = await seguimiento.save();
    res.json(updatedSeguimiento);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un seguimiento por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Seguimiento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Seguimiento academico eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;