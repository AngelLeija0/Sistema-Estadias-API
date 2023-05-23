const express = require('express');
const router = express.Router();
const Periodo = require('../models/periodo');

// GET - Obtener todos los periodos
router.get('/', async (req, res) => {
  try {
    const periodos = await Periodo.find();
    res.json(periodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener periodo por id
router.get('/:id', async (req, res) => {
  try {
    const periodo = await Periodo.find(req.body.id);
    res.json(periodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo periodo
router.post('/', async (req, res) => {
  try {
    const periodo = new Periodo({
      periodo: req.body.periodo
    });
    const newPeriodo = await periodo.save();
    res.status(201).json(newPeriodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un periodo por su ID
router.patch('/:id', async (req, res) => {
  try {
    const periodo = await Periodo.findById(req.params.id);
    periodo.periodo = req.body.periodo || periodo.periodo;
    const updatedPeriodo = await periodo.save();
    res.json(updatedPeriodo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un periodo por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Periodo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Periodo eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;