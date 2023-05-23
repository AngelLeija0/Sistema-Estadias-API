const express = require('express');
const router = express.Router();
const Carrera = require('../models/carrera');

// GET - Obtener todas las carreras
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

// GET - Obtener carrera por dato
router.get('/:data', async (req, res) => {
  try {
      const schemaProperties = Object.keys(Carrera.schema.obj);
      
      for (const properties of schemaProperties) {
          const filter = {};
          filter[properties] = req.params.data;
          const carrera = await Carrera.findOne(filter);
          if (carrera !== null) {
              return res.json(carrera)
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST - Crear una nueva carrera
router.post('/', async (req, res) => {
  try {
    const carrera = new Carrera({
      nombreCarrera: req.body.nombreCarrera,
      descripcionCarrera: req.body.descripcionCarrera,
      directorCarrera: req.body.directorCarrera
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
    carrera.nombreCarrera = req.body.nombreCarrera || carrera.nombreCarrera;
    carrera.descripcionCarrera = req.body.descripcionCarrera || carrera.descripcionCarrera;
    carrera.directorCarrera = req.body.directorCarrera || carrera.directorCarrera;
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
    res.json({ message: 'Carrera eliminada' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;