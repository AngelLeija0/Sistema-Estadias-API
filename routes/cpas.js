const express = require('express');
const router = express.Router();
const CPA = require('../models/cpa');

// GET - Obtener todas las CPA
router.get('/', async (req, res) => {
  try {
    const cpa = await CPA.find();
    res.json(cpa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear una nueva CPA
router.post('/', async (req, res) => {
  try {
    const cpa = new CPA({
      idEstudiante: req.body.idEstudiante,
      idGrado: req.body.idGrado,
      idGrupo: req.body.idGrupo,
      idPeriodo: req.body.idPeriodo,
      idTurno: req.body.idTurno,
      telefono: req.body.telefono,
      nss: req.body.nss,
      curp: req.body.curp,
      nombreEmpresa: req.body.nombreEmpresa,
      nombreEmpresario: req.body.nombreEmpresario,
      puestoEmpresario: req.body.puestoEmpresario
    });
    const newCpa = await cpa.save();
    res.status(201).json(newCpa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar una CPA por su ID
router.patch('/:id', async (req, res) => {
  try {
    const cpa = await CPA.findById(req.params.id);
    cpa.idEstudiante = req.body.idEstudiante || cpa.idEstudiante;
    cpa.idGrado = req.body.idGrado || cpa.idGrado;
    cpa.idGrupo = req.body.idGrupo || cpa.idGrupo;
    cpa.idPeriodo = req.body.idPeriodo || cpa.idPeriodo;
    cpa.idTurno = req.body.idTurno || cpa.idTurno;
    cpa.telefono = req.body.telefono || cpa.telefono;
    cpa.nss = req.body.nss || cpa.nss;
    cpa.curp = req.body.curp || cpa.curp;
    cpa.nombreEmpresa = req.body.nombreEmpresa || cpa.nombreEmpresa;
    cpa.nombreEmpresario = req.body.nombreEmpresario || cpa.nombreEmpresario;
    cpa.puestoEmpresario = req.body.puestoEmpresario || cpa.puestoEmpresario;
    const updatedCpa = await cpa.save();
    res.json(updatedCpa);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE - Eliminar una CPA por su ID
router.delete('/:id', async (req, res) => {
  try {
    await CPA.findByIdAndDelete(req.params.id);
    res.json({ message: 'CPA eliminada' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;