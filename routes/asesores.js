const express = require('express');
const router = express.Router();
const Asesor = require('../models/asesor');

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
router.get('/id/:id', async (req, res) => {
  try {
    const asesor = await Asesor.findById(req.params.id);
    res.json(asesor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo asesor
router.post('/', async (req, res) => {
  try {
    const asesor = new Asesor({
      datosPersonales: {
        nombres: {
          nombre: req.body.datosPersonales.nombres.nombre,
          apPaterno: req.body.datosPersonales.nombres.apPaterno,
          apMaterno: req.body.datosPersonales.nombres.apMaterno
        },
        privado: {
          email: req.body.datosPrivados.privado.email,
          telefono: req.body.datosPrivados.privado.telefono,
          username: req.body.datosPrivados.privado.username,
          password: req.body.datosPrivados.privado.password
        },
      },
      fechaRegistro: req.body.fechaRegistro
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
    asesor.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || asesor.datosPersonales.nombres.nombre;
    asesor.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || asesor.datosPersonales.nombres.apPaterno;
    asesor.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || asesor.datosPersonales.nombres.apMaterno;
    asesor.datosPersonales.privado.email = req.body.datosPersonales.privado.email || asesor.datosPersonales.privado.email;
    asesor.datosPersonales.privado.telefono = req.body.datosPersonales.privado.telefono || asesor.datosPersonales.privado.telefono;
    asesor.datosPersonales.privado.username = req.body.datosPersonales.privado.username || asesor.datosPersonales.privado.username;
    asesor.datosPersonales.privado.password = req.body.datosPersonales.privado.password || asesor.datosPersonales.privado.password;
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