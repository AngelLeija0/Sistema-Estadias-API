const express = require('express');
const router = express.Router();
const Seguimiento = require('../models/seguimiento');
const { exists } = require('../models/administrador');

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
router.get('/:id', async (req, res) => {
  try {
    const seguimiento = await Seguimiento.find(req.body.id);
    res.json(seguimiento);
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
      emailEmpresario: req.body.emailEmpresario,
      telfEmpresario: req.body.telfEmpresario,
      proyecto: req.body.proyecto,
      objetivo: req.body.objetivo,
      descripcion: req.body.descripcion,
      fechaRegistro: req.body.fechaRegistro
    });
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
    seguimiento.idAsesor = req.body.idAsesor || seguimiento.idAsesor;
    seguimiento.idEstudiante = req.body.idEstudiante || seguimiento.idEstudiante;
    seguimiento.emailEmpresario = req.body.emailEmpresario || seguimiento.emailEmpresario;
    seguimiento.telfEmpresario = req.body.telfEmpresario || seguimiento.telfEmpresario;
    seguimiento.proyecto = req.body.proyecto || seguimiento.proyecto;
    seguimiento.objetivo = req.body.objetivo || seguimiento.objetivo;
    seguimiento.descripcion = req.body.descripcion || seguimiento.descripcion;
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
    res.json({ message: 'Seguimiento eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;