const express = require('express');
const router = express.Router();
const Estudiante = require('../models/estudiante');

// GET - Obtener todos los estudiantes
router.get('/', async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener estudiante por id
router.get('/:id', async (req, res) => {
  try {
    const estudiante = await Estudiante.find(req.body.id);
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo estudiante
router.post('/', async (req, res) => {
  try {
    const estudiante = new Estudiante({
      idCarrera: req.body.idCarrera,
      nombreEstudiante: req.body.nombreEstudiante,
      apParternoEstudiante: req.body.apParternoEstudiante,
      apMaternoEstudiante: req.body.apMaternoEstudiante,
      emailEstudiante: req.body.emailEstudiante,
      passwordEstudiante: req.body.passwordEstudiante
    });
    const newEstudiante = await estudiante.save();
    res.status(201).json(newEstudiante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un estudiante por su ID
router.patch('/:id', async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    estudiante.idCarrera = req.body.idCarrera || estudiante.idCarrera;
    estudiante.nombreEstudiante = req.body.nombreEstudiante || estudiante.nombreEstudiante;
    estudiante.apParternoEstudiante = req.body.apParternoEstudiante || estudiante.apParternoEstudiante;
    estudiante.apMaternoEstudiante = req.body.apMaternoEstudiante || estudiante.apMaternoEstudiante;
    estudiante.emailEstudiante = req.body.emailEstudiante || estudiante.emailEstudiante;
    estudiante.passwordEstudiante = req.body.passwordEstudiante || estudiante.passwordEstudiante;
    const updatedEstudiante = await estudiante.save();
    res.json(updatedEstudiante);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un estudiante por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Estudiante.findByIdAndDelete(req.params.id);
    res.json({ message: 'Estudiante eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;