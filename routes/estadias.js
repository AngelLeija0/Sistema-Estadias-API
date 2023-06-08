const express = require('express');
const router = express.Router();
const Estadia = require('../models/estadia');

// GET - Obtener todos las estadias
router.get('/', async (req, res) => {
  try {
    const estadias = await Estadia.find();
    res.json(estadias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener estadias por id
router.get('/id/:id', async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo alumno
router.post('/', async (req, res) => {
  try {
    const alumno = new alumno({
      datosPersonales: {
        nombres: {
          nombre: req.body.datosPersonales.nombres.nombre,
          apPaterno: req.body.datosPersonales.nombres.apPaterno,
          apMaterno: req.body.datosPersonales.nombres.apMaterno
        },
        privado: {
          email: req.body.datosPersonales.privado.email,
          telefono: req.body.datosPersonales.privado.telefono,
          username: req.body.datosPersonales.privado.username,
          password: req.body.datosPersonales.privado.password
        },
      },
      datosAcademicos: {
        idCarrera: req.body.datosAcademicos.idCarrera,
        grado: req.body.datosAcademicos.grado,
        grupo: req.body.datosAcademicos.grupo
      },
      fechaRegistro: new Date(req.body.fechaRegistro)
    });
    const newalumno = await Alumno.save();
    res.status(201).json(newalumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar un alumno por su ID
router.patch('/:id', async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    alumno.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || alumno.datosPersonales.nombres.nombre;
    alumno.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || alumno.datosPersonales.nombres.apPaterno;
    alumno.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || alumno.datosPersonales.nombres.apMaterno;
    alumno.datosPersonales.privado.email = req.body.datosPersonales.privado.email || alumno.datosPersonales.privado.email;
    alumno.datosPersonales.privado.telefono = req.body.datosPersonales.privado.telefono || alumno.datosPersonales.privado.telefono;
    alumno.datosPersonales.privado.username = req.body.datosPersonales.privado.username || alumno.datosPersonales.privado.username;
    alumno.datosPersonales.privado.password = req.body.datosPersonales.privado.password || alumno.datosPersonales.privado.password;
    alumno.datosAcademicos.idCarrera = req.body.datosAcademicos.idCarrera || alumno.datosAcademicos.idCarrera;
    alumno.datosAcademicos.grado = req.body.datosAcademicos.grado || alumno.datosAcademicos.grado;
    alumnos.datosAcademicos.grupo = req.body.datosAcademicos.grupo || alumno.datosAcademicos.grupo;
    const updatedAlumno = await Alumno.save();
    res.json(updatedAlumno);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar un alumno por su ID
router.delete('/:id', async (req, res) => {
  try {
    await Alumno.findByIdAndDelete(req.params.id);
    res.json({ message: 'alumno eliminado' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;