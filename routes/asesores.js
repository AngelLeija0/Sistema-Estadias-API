const express = require('express');
const router = express.Router();
const Asesor = require('../models/asesor');
const asesor = require('../models/asesor');

// GET - Obtener todos los asesores
router.get('/', async (req, res) => {
  try {
    const asesores = await Asesor.find();
    res.json(asesores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener asesor por id
router.get('/:id', async (req, res) => {
  try {
    const asesor = await Asesor.findById(req.body.id);
    res.json(asesor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener asesor por dato
router.get('/:data', async (req, res) => {
  try {
      const schemaProperties = Object.keys(Asesor.schema.obj);
      
      for (const properties of schemaProperties) {
          const filter = {};
          filter[properties] = req.params.data;
          const asesor = await Asesor.findOne(filter);
          if (asesor !== null) {
              return res.json(asesor)
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo asesor
router.post('/', async (req, res) => {
  try {
    const asesor = new Asesor({
      idCarrera: req.body.idCarrera,
      nombreAsesor: req.body.nombreAsesor,
      apPaternoAsesor: req.body.apPaternoAsesor,
      apMaternoAsesor: req.body.apMaternoAsesor,
      emailAsesor: req.body.emailAsesor,
      telfAsesor: req.body.telfAsesor,
      usernameAsesor: req.body.usernameAsesor,
      passwordAsesor: req.body.passwordAsesor
    });
    const newAsesor = await asesor.save();
    res.status(201).json(newAsesor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un asesor por su ID
router.patch('/:id', async (req, res) => {
  try {
    const asesor = await Asesor.findById(req.params.id);
    asesor.idCarrera = req.body.idCarrera || asesor.idCarrera;
    asesor.nombreAsesor = req.body.nombreAsesor || asesor.nombreAsesor;
    asesor.apPaternoAsesor = req.body.apPaternoAsesor || asesor.apPaternoAsesor;
    asesor.apMaternoAsesor = req.body.apMaternoAsesor || asesor.apMaternoAsesor;
    asesor.emailAsesor = req.body.emailAsesor || asesor.emailAsesor;
    asesor.telfAsesor = req.body.telfAsesor || asesor.telfAsesor;
    asesor.usernameAsesor = req.body.usernameAsesor || asesor.usernameAsesor;
    asesor.passwordAsesor = req.body.passwordAsesor || asesor.passwordAsesor;
    const updatedAsesor = await asesor.save();
    res.json(updatedAsesor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un asesor por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Asesor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asesor eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;