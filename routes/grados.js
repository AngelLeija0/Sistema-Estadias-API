const express = require('express');
const router = express.Router();
const Grado = require('../models/grado');

// GET - Obtener todos los grados
router.get('/', async (req, res) => {
  try {
    const grados = await Grado.find();
    res.json(grados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener grado por id
router.get('/:id', async (req, res) => {
  try {
    const grado = await Grado.findById(req.body.id);
    res.json(grado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener grado por dato
router.get('/:data', async (req, res) => {
  try {
      const schemaProperties = Object.keys(Grado.schema.obj);
      
      for (const properties of schemaProperties) {
          const filter = {};
          filter[properties] = req.params.data;
          const grado = await Grado.findOne(filter);
          if (grado !== null) {
              return res.json(grado)
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo grado
router.post('/', async (req, res) => {
  try {
    const grado = new Grado({
      grado: req.body.grado
    });
    const newGrado = await grado.save();
    res.status(201).json(newGrado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un grado por su ID
router.patch('/:id', async (req, res) => {
  try {
    const grado = await Grado.findById(req.params.id);
    grado.grado = req.body.grado || grado.grado;
    const updatedGrado = await grado.save();
    res.json(updatedGrado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un grado por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Grado.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grado eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;