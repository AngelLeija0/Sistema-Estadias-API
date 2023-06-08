const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();
const Alumno = require('../models/alumno');

// GET - Obtener todos los alumnos
router.get('/', async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener alumno por id
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
    const alumno = new Alumno({
      datosPersonales: {
        nombres: {
          nombre: req.body.datosPersonales.nombres.nombre,
          apPaterno: req.body.datosPersonales.nombres.apPaterno,
          apMaterno: req.body.datosPersonales.nombres.apMaterno
        },
        privado: {
          matricula: req.body.datosPersonales.privado.matricula,
          email: req.body.datosPersonales.privado.email,
          password: req.body.datosPersonales.privado.password
        },
      },
      datosAcademicos: {
        idCarrera: new ObjectId(req.body.datosAcademicos.idCarrera),
        grado: req.body.datosAcademicos.grado,
        grupo: req.body.datosAcademicos.grupo
      },
      fechaRegistro: new Date(req.body.fechaRegistro)
    });
    const newalumno = await alumno.save();
    res.status(201).json(newalumno);
  } catch (error) {
    res.json(req.body)
    //res.status(400).json({ message: error.message });
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
    alumno.datosPersonales.privado.matricula = req.body.datosPersonales.privado.matricula || alumno.datosPersonales.privado.matricula;
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