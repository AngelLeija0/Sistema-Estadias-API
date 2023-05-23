const express = require('express');
const router = express.Router();
const Grupo = require('../models/grupo');

// GET - Obtener todos los grupos
router.get('/', async (req, res) => {
  try {
    const grupos = await Grupo.find();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener grupo por id
router.get('/:id', async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.body.id);
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener grupo por dato
router.get('/:data', async (req, res) => {
  try {
      const schemaProperties = Object.keys(Grupo.schema.obj);
      
      for (const properties of schemaProperties) {
          const filter = {};
          filter[properties] = req.params.data;
          const grupo = await Grupo.findOne(filter);
          if (grupo !== null) {
              return res.json(grupo)
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo grupo
router.post('/', async (req, res) => {
  try {
    const grupo = new Grupo({
      grupo: req.body.grupo
    });
    const newGrupo = await grupo.save();
    res.status(201).json(newGrupo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un grupo por su ID
router.patch('/:id', async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    grupo.grupo = req.body.grupo || grupo.grupo;
    const updatedGrupo = await grupo.save();
    res.json(updatedGrupo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un grupo por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Grupo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grupo eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;