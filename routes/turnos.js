const express = require('express');
const router = express.Router();
const Turno = require('../models/turno');

// GET - Obtener todos los turnos
router.get('/', async (req, res) => {
  try {
    const turnos = await Turno.find();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener turno por id
router.get('/id/:id', async (req, res) => {
  try {
    const turno = await Turno.findById(req.params.id);
    res.json(turno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener turno por dato
router.get('/:data', async (req, res) => {
  try {
      const schemaProperties = Object.keys(Turno.schema.obj);
      
      for (const properties of schemaProperties) {
          const filter = {};
          filter[properties] = req.params.data;
          const turno = await Turno.findOne(filter);
          if (turno !== null) {
              return res.json(turno)
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo turno
router.post('/', async (req, res) => {
  try {
    const turno = new Turno({
      turno: req.body.turno
    });
    const newTurno = await turno.save();
    res.status(201).json(newTurno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un turno por su ID
router.patch('/:id', async (req, res) => {
  try {
    const turno = await Turno.findById(req.params.id);
    turno.turno = req.body.turno || turno.turno;
    const updatedTurno = await turno.save();
    res.json(updatedTurno);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un turno por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Turno.findByIdAndDelete(req.params.id);
    res.json({ message: 'Turno eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;