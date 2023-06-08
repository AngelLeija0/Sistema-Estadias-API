const express = require('express');
const router = express.Router();
const Carrera = require('../models/carrera');

// GET - Obtener todos las Carreras
router.get('/', async (req, res) => {
  try {
    const carreras = await Carrera.find();
    res.json(carreras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener carrera por id
router.get('/id/:id', async (req, res) => {
  try {
    const carrera = await Carrera.findById(req.params.id);
    res.json(carrera);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nueva carrera
router.post('/', async (req, res) => {
  try {
    const carrera = new Carrera({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        director: req.body.director,
        area: {
          nombre: req.body.area.nivel,
          turno: req.body.area.nivel,
          nivel: req.body.area.nivel 
        },
        fechaRegistro: req.body.fechaRegistro
    });
    const newCarrera = await carrera.save();
    res.status(201).json(newCarrera);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar una carrera por su ID
router.patch('/:id', async (req, res) => {
  try {
    const carrera = await Carrera.findById(req.params.id);
    carrera.nombre = req.body.nombre || carrera.nombre;
    carrera.descripcion = req.body.descripcion || carrera.descripcion;
    carrera.director = req.body.director || carrera.director;
    carrera.area.nombre = req.body.area.nombre || carrera.area.nombre;
    carrera.area.turno = req.body.area.turno || carrera.area.turno;
    carrera.area.nivel = req.body.area.nivel || carrera.area.nivel;
    const updatedCarrera = await carrera.save();
    res.json(updatedCarrera);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar una carrera por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Carrera.findByIdAndDelete(req.params.id);
    res.json({ message: 'Carrera eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;