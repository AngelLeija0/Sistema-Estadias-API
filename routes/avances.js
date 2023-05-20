const express = require('express');
const router = express.Router();
const Avance = require('../models/avance');

// GET - Obtener todos los avances
router.get('/', async (req, res) => {
  try {
    const avances = await Avance.find();
    res.json(avances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo avance
router.post('/', async (req, res) => {
  try {
    const avance = new Avance({
      idCPA: req.body.idCPA,
      etapa1: req.body.etapa1,
      etapa1Fecha: req.body.etapa1Fecha,
      etapa2: req.body.etapa2,
      etapa2Fecha: req.body.etapa2Fecha,
      etapa3: req.body.etapa3,
      etapa3Fecha: req.body.etapa3Fecha,
      etapa4: req.body.etapa4,
      etapa4Fecha: req.body.etapa4Fecha,
      etapa5: req.body.etapa5,
      etapa5Fecha: req.body.etapa5Fecha,
      progreso: req.body.progreso
    });
    const newAvance = await avance.save();
    res.status(201).json(newAvance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un avance por su ID
router.patch('/:id', async (req, res) => {
  try {
    const avance = await Avance.findById(req.params.id);
    avance.idCPA = req.body.idCPA || avance.idCPA;
    avance.etapa1 = req.body.etapa1 || avance.etapa1;
    avance.etapa1Fecha = req.body.etapa1Fecha || avance.etapa1Fecha;
    avance.etapa2 = req.body.etapa2 || avance.etapa2;
    avance.etapa2Fecha = req.body.etapa2Fecha || avance.etapa2Fecha;
    avance.etapa3 = req.body.etapa3 || avance.etapa3;
    avance.etapa3Fecha = req.body.etapa3Fecha || avance.etapa3Fecha;
    avance.etapa4 = req.body.etapa4 || avance.etapa4;
    avance.etapa4Fecha = req.body.etapa4Fecha || avance.etapa4Fecha;
    avance.etapa5 = req.body.etapa5 || avance.etapa5;
    avance.etapa5Fecha = req.body.etapa5Fecha || avance.etapa5Fecha;
    avance.progreso = req.body.progreso || avance.progreso;
    const updatedAvance = await avance.save();
    res.json(updatedAvance);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un avance por su ID
router.delete('/:id', async (req, res) => {
  try {
    const avance = await Avance.findById(req.params.id);
    await avance.remove();
    res.json({ message: 'Avance eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;