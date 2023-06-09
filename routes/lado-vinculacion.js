const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const Estadia = require('../models/estadia');
const Alumno = require('../models/alumno');

/* Lado vinculacion */

// POST - Busqueda de alumnos en proceso de estadias
router.post('/alumnos/proceso', async (req, res) => {
    try {
        let alumnos = [];
        const filtro = req.body.filtro
        const estadias = await Estadia.find();
        for (const estadia of estadias) {
            if (!estadia.documentos || !estadia.documentos.cta || estadia.documentos.cta.estado.nombre !== "Aceptada") {
                const idAlumno = estadia._doc.idAlumno;
                const busqueda = {
                    _id: new ObjectId(idAlumno)
                };
                if (filtro.buscador) {
                    const textoBusqueda = filtro.buscador;
                    const regex = new RegExp(textoBusqueda, 'i');
                    busqueda.$or = [
                        { 'datosPersonales.nombres.nombre': regex },
                        { 'datosPersonales.nombres.apPaterno': regex },
                        { 'datosPersonales.nombres.apMaterno': regex },
                        { 'datosPersonales.privado.matricula': regex },
                    ];
                    const numeroPartes = textoBusqueda.split(" ");
                    if (numeroPartes.length >= 2) {
                        const nombre = numeroPartes.slice(0, numeroPartes.length - 2).join(" ");
                        const apPaterno = numeroPartes[numeroPartes.length - 2];
                        const apMaterno = numeroPartes[numeroPartes.length - 1];
                        busqueda.$or.push({ 'datosPersonales.nombres.nombre': nombre });
                        busqueda.$or.push({ 'datosPersonales.nombres.apPaterno': apPaterno });
                        busqueda.$or.push({ 'datosPersonales.nombres.apMaterno': apMaterno });
                    }
                }
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
        }
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Busqueda de alumnos liberados del proceso de estadias
router.post('/alumnos/liberados', async (req, res) => {
    try {
        let alumnos = [];
        const filtro = req.body.filtro
        const estadias = await Estadia.find();
        for (const estadia of estadias) {
            if (estadia.documentos.cta.estado.nombre == "Aceptada" && estadia.avance.progreso == 100) {
                const idAlumno = estadia._doc.idAlumno;
                const busqueda = {
                    _id: new ObjectId(idAlumno)
                };
                if (filtro.buscador) {
                    const textoBusqueda = filtro.buscador;
                    const regex = new RegExp(textoBusqueda, 'i');
                    busqueda.$or = [
                        { 'datosPersonales.nombres.nombre': regex },
                        { 'datosPersonales.nombres.apPaterno': regex },
                        { 'datosPersonales.nombres.apMaterno': regex },
                        { 'datosPersonales.privado.matricula': regex },
                    ];
                    const numeroPartes = textoBusqueda.split(" ");
                    if (numeroPartes.length >= 2) {
                        const nombre = numeroPartes.slice(0, numeroPartes.length - 2).join(" ");
                        const apPaterno = numeroPartes[numeroPartes.length - 2];
                        const apMaterno = numeroPartes[numeroPartes.length - 1];
                        busqueda.$or.push({ 'datosPersonales.nombres.nombre': nombre });
                        busqueda.$or.push({ 'datosPersonales.nombres.apPaterno': apPaterno });
                        busqueda.$or.push({ 'datosPersonales.nombres.apMaterno': apMaterno });
                    }
                }
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
        }
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Busqueda de historial de alumnos
router.post('/alumnos/historial', async (req, res) => {
    try {
        let alumnos = [];
        const filtro = req.body.filtro;
        const busqueda = {}
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
            if (filtro.buscador) {
                const textoBusqueda = filtro.buscador;
                const regex = new RegExp(textoBusqueda, 'i');
                busqueda.$or = [
                    { 'datosPersonales.nombres.nombre': regex },
                    { 'datosPersonales.nombres.apPaterno': regex },
                    { 'datosPersonales.nombres.apMaterno': regex },
                    { 'datosPersonales.privado.matricula': regex },
                ];
                const numeroPartes = textoBusqueda.split(" ");
                if (numeroPartes.length >= 2) {
                    const nombre = numeroPartes.slice(0, numeroPartes.length - 2).join(" ");
                    const apPaterno = numeroPartes[numeroPartes.length - 2];
                    const apMaterno = numeroPartes[numeroPartes.length - 1];
                    busqueda.$or.push({ 'datosPersonales.nombres.nombre': nombre });
                    busqueda.$or.push({ 'datosPersonales.nombres.apPaterno': apPaterno });
                    busqueda.$or.push({ 'datosPersonales.nombres.apMaterno': apMaterno });
                }
            }
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

// POST - Ver perfil alumno
router.post('/alumno/perfil', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const alumno = await Alumno.findById(idAlumno);
        const estadia = await Estadia.findOne({
            idAlumno: new ObjectId(idAlumno)
        })
        const infoAlumno = {
            idAlumno: idAlumno,
            // Informacion general
            nombre: alumno.datosPersonales.nombres.nombre,
            apPaterno: alumno.datosPersonales.nombres.apPaterno,
            apMaterno: alumno.datosPersonales.nombres.apMaterno,
            matricula: alumno.datosPersonales.privado.matricula,
            nivelAcademico: alumno.datosAcademicos.nivelAcademico,
            turno: alumno.datosAcademicos.turno,
            carrera: alumno.datosAcademicos.carrera,
            area: alumno.datosAcademicos.area,
            grado: alumno.datosAcademicos.grado,
            grupo: alumno.datosAcademicos.grupo,
        };
        if (estadia.cartaPresentacion) {
            infoAlumno.cartaPresentacion = estadia.cartaPresentacion
        }
        if (estadia.documentos) {
            infoAlumno.documentos = estadia.documentos;
        }
        res.json(infoAlumno);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;