const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const Estadia = require('../models/estadia');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');

// POST - Estado carta presentacion
router.post('/cpa/estado', async (req, res) => {
    try {
        let alumnos = [];
        const filtro = req.body.filtro;
        const estadias = await Estadia.find({
            idAsesor: new ObjectId(req.body.idAsesor)
        });
        for (const estadia of estadias) {
            const idAlumno = estadia._doc.idAlumno;
            const busqueda = {
                _id: new ObjectId(idAlumno)
            };

            if (filtro.nivelAcademico) {
                busqueda["datosAcademicos.nivelAcademico"] = filtro.nivelAcademico;
            }

            if (filtro.carrera) {
                busqueda["datosAcademicos.carrera"] = filtro.carrera;
            }

            if (filtro.area) {
                busqueda["datosAcademicos.area"] = filtro.area;
            }
            const alumno = await Alumno.findOne(busqueda);
            if (alumno) {
                const infoAlumno = {
                    idAlumno: idAlumno,
                    nombre: alumno.datosPersonales.nombres.nombre,
                    apPaterno: alumno.datosPersonales.nombres.apPaterno,
                    apMaterno: alumno.datosPersonales.nombres.apMaterno,
                    matricula: alumno.datosPersonales.privado.matricula,
                    nivelAcademico: alumno.datosAcademicos.nivelAcademico,
                    carrera: alumno.datosAcademicos.carrera,
                    area: alumno.datosAcademicos.area
                };
                alumnos.push(infoAlumno);
            }
        }
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;