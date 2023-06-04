const express = require('express');
const router = express.Router();
const SeguimientoAdm = require('../models/seguimientoAdministrativo');

// GET - Obtener todos los seguimientos
router.get('/', async (req, res) => {
    try {
        const seguimientos = await SeguimientoAdm.find();
        res.json(seguimientos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Obtener seguimiento por id
router.get('/id/:id', async (req, res) => {
    try {
        const seguimiento = await SeguimientoAdm.findById(req.params.id);
        res.json(seguimiento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Crear un nuevo seguimiento
router.post('/', async (req, res) => {
    try {
        const seguimiento = new Seguimiento({
            fechaRegistro: req.body.fechaRegistro
        });
        // Verificar request
        if (req.body.curriculum) {
            seguimiento.curriculum = {
                archivo: req.body.curriculum.archivo,
                estado: {
                    nombre: req.body.curriculum.estado.nombre,
                    motivo: req.body.curriculum.estado.motivo,
                    fecha: req.body.curriculum.estado.fecha
                }
            }
        }
        if (req.body.nss) {
            seguimiento.nss = {
                archivo: req.body.nss.archivo,
                estado: {
                    nombre: req.body.nss.estado.nombre,
                    motivo: req.body.nss.estado.motivo,
                    fecha: req.body.nss.estado.fecha
                }
            }
        }
        if (req.body.cpa) {
            seguimiento.cpa = {
                archivo: req.body.cpa.archivo,
                estado: {
                    nombre: req.body.cpa.estado.nombre,
                    motivo: req.body.cpa.estado.motivo,
                    fecha: req.body.cpa.estado.fecha
                }
            }
        }
        if (req.body.caa) {
            seguimiento.caa = {
                archivo: req.body.caa.archivo,
                estado: {
                    nombre: req.body.caa.estado.nombre,
                    motivo: req.body.caa.estado.motivo,
                    fecha: req.body.caa.estado.fecha
                }
            }
        }
        if (req.body.reporte) {
            seguimiento.reporte = {
                archivo: req.body.reporte.archivo,
                estado: {
                    nombre: req.body.reporte.estado.nombre,
                    motivo: req.body.reporte.estado.motivo,
                    fecha: req.body.reporte.estado.fecha
                }
            }
        }
        if (req.body.rubrica) {
            seguimiento.rubrica = {
                archivo: req.body.rubrica.archivo,
                estado: {
                    nombre: req.body.rubrica.estado.nombre,
                    motivo: req.body.rubrica.estado.motivo,
                    fecha: req.body.rubrica.estado.fecha
                }
            }
        }
        if (req.body.dictamen) {
            seguimiento.dictamen = {
                archivo: req.body.dictamen.archivo,
                estado: {
                    nombre: req.body.dictamen.estado.nombre,
                    motivo: req.body.dictamen.estado.motivo,
                    fecha: req.body.dictamen.estado.fecha
                }
            }
        }
        if (req.body.protesta) {
            seguimiento.protesta = {
                archivo: req.body.protesta.archivo,
                estado: {
                    nombre: req.body.protesta.estado.nombre,
                    motivo: req.body.protesta.estado.motivo,
                    fecha: req.body.protesta.estado.fecha
                }
            }
        }
        if (req.body.cta) {
            seguimiento.cta = {
                archivo: req.body.cta.archivo,
                estado: {
                    nombre: req.body.cta.estado.nombre,
                    motivo: req.body.cta.estado.motivo,
                    fecha: req.body.cta.estado.fecha
                }
            }
        }
        const newSeguimiento = await seguimiento.save();
        res.status(201).json(newSeguimiento);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH - Actualizar un seguimiento por su ID
router.patch('/:id', async (req, res) => {
    try {
        const seguimiento = await SeguimientoAdm.findById(req.params.id);
        if (req.body.curriculum) {
            seguimiento.curriculum.archivo = req.body.curriculum.archivo || seguimiento.curriculum.archivo;
            seguimiento.curriculum.estado.nombre = req.body.curriculum.estado.nombre || seguimiento.curriculum.estado.nombre;
            seguimiento.curriculum.estado.motivo = req.body.curriculum.estado.motivo || seguimiento.curriculum.estado.motivo;
            seguimiento.curriculum.estado.fecha = req.body.curriculum.estado.fecha || seguimiento.curriculum.estado.fecha;
        }
        if (req.body.nss) {
            seguimiento.nss.archivo = req.body.nss.archivo || seguimiento.nss.archivo;
            seguimiento.nss.estado.nombre = req.body.nss.estado.nombre || seguimiento.nss.estado.nombre;
            seguimiento.nss.estado.motivo = req.body.nss.estado.motivo || seguimiento.nss.estado.motivo;
            seguimiento.nss.estado.fecha = req.body.nss.estado.fecha || seguimiento.nss.estado.fecha;
        }
        if (req.body.cpa) {
            seguimiento.cpa.archivo = req.body.cpa.archivo || seguimiento.cpa.archivo;
            seguimiento.cpa.estado.nombre = req.body.cpa.estado.nombre || seguimiento.cpa.estado.nombre;
            seguimiento.cpa.estado.motivo = req.body.cpa.estado.motivo || seguimiento.cpa.estado.motivo;
            seguimiento.cpa.estado.fecha = req.body.cpa.estado.fecha || seguimiento.cpa.estado.fecha;
        }
        if (req.body.caa) {
            seguimiento.caa.archivo = req.body.caa.archivo || seguimiento.caa.archivo;
            seguimiento.caa.estado.nombre = req.body.caa.estado.nombre || seguimiento.caa.estado.nombre;
            seguimiento.caa.estado.motivo = req.body.caa.estado.motivo || seguimiento.caa.estado.motivo;
            seguimiento.caa.estado.fecha = req.body.caa.estado.fecha || seguimiento.caa.estado.fecha;
        }
        if (req.body.reporte) {
            seguimiento.reporte.archivo = req.body.reporte.archivo || seguimiento.reporte.archivo;
            seguimiento.reporte.estado.nombre = req.body.reporte.estado.nombre || seguimiento.reporte.estado.nombre;
            seguimiento.reporte.estado.motivo = req.body.reporte.estado.motivo || seguimiento.reporte.estado.motivo;
            seguimiento.reporte.estado.fecha = req.body.reporte.estado.fecha || seguimiento.reporte.estado.fecha;
        }
        if (req.body.rubrica) {
            seguimiento.rubrica.archivo = req.body.rubrica.archivo || seguimiento.rubrica.archivo;
            seguimiento.rubrica.estado.nombre = req.body.rubrica.estado.nombre || seguimiento.rubrica.estado.nombre;
            seguimiento.rubrica.estado.motivo = req.body.rubrica.estado.motivo || seguimiento.rubrica.estado.motivo;
            seguimiento.rubrica.estado.fecha = req.body.rubrica.estado.fecha || seguimiento.rubrica.estado.fecha;
        }
        if (req.body.dictamen) {
            seguimiento.dictamen.archivo = req.body.dictamen.archivo || seguimiento.dictamen.archivo;
            seguimiento.dictamen.estado.nombre = req.body.dictamen.estado.nombre || seguimiento.dictamen.estado.nombre;
            seguimiento.dictamen.estado.motivo = req.body.dictamen.estado.motivo || seguimiento.dictamen.estado.motivo;
            seguimiento.dictamen.estado.fecha = req.body.dictamen.estado.fecha || seguimiento.dictamen.estado.fecha;
        }
        if (req.body.protesta) {
            seguimiento.protesta.archivo = req.body.protesta.archivo || seguimiento.protesta.archivo;
            seguimiento.protesta.estado.nombre = req.body.protesta.estado.nombre || seguimiento.protesta.estado.nombre;
            seguimiento.protesta.estado.motivo = req.body.protesta.estado.motivo || seguimiento.protesta.estado.motivo;
            seguimiento.protesta.estado.fecha = req.body.protesta.estado.fecha || seguimiento.protesta.estado.fecha;
        }
        if (req.body.cta) {
            seguimiento.cta.archivo = req.body.cta.archivo || seguimiento.cta.archivo;
            seguimiento.cta.estado.nombre = req.body.cta.estado.nombre || seguimiento.cta.estado.nombre;
            seguimiento.cta.estado.motivo = req.body.cta.estado.motivo || seguimiento.cta.estado.motivo;
            seguimiento.cta.estado.fecha = req.body.cta.estado.fecha || seguimiento.cta.estado.fecha;
        }
        seguimiento.fechaRegistro = req.body.fechaRegistro || seguimiento.fechaRegistro;
        const updatedSeguimiento = await seguimiento.save();
        res.json(updatedSeguimiento);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// DELETE - Eliminar un seguimiento por su ID
router.delete('/:id', async (req, res) => {
    try {
        await SeguimientoAdm.findByIdAndDelete(req.params.id);
        res.json({ message: 'Seguimiento administrativo eliminado' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;