const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const path = require('path');

const ExcelJS = require('exceljs');

const Estadia = require('../models/estadia');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');
const Vinculador = require('../models/vinculador');

// POST - Busqueda de alumnos liberados del proceso de estadias
router.post('/estadistica-alumnos', async (req, res) => {
    try {
        let alumnosEntrantes = [];
        let alumnosSalientes = [];
        const filtro = req.body.filtro;
        const busqueda = {};
        if (filtro.año) {
            busqueda["cartaPresentacion.datosAcademicos.año"] = filtro.año;
        }
        if (filtro.periodo) {
            busqueda["cartaPresentacion.datosAcademicos.periodo"] = filtro.periodo;
        }
        const estadias = await Estadia.find(busqueda);
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
            if (filtro.grado) {
                busqueda["datosAcademicos.grado"] = filtro.grado;
            }
            if (filtro.grupo) {
                busqueda["datosAcademicos.grupo"] = filtro.grupo;
            }

            if (estadia.documentos.cta.estado.nombre == "Aceptada" && estadia.avance.progreso == 100) {
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
                    alumnosEntrantes.push(infoAlumno);
                }
            }
            else {
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
                    alumnosSalientes.push(infoAlumno);
                }
            }
        }
        console.log(alumnosEntrantes);
        console.log(alumnosSalientes);
        res.json({
            initalStudents: {
                quantity: alumnosEntrantes.length,
                students: alumnosEntrantes
            },
            outgoingStudents: {
                quantity: alumnosSalientes.length,
                students: alumnosSalientes
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;