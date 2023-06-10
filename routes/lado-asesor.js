const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const Estadia = require('../models/estadia');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');

// POST - Pagina de inicio (Alumnos asesorados) - Filtrar alumnos asesorados por nivel de estudios, carrera y area.
router.post('/inicio', async (req, res) => {
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

// POST - Ver perfil alumno
router.post('/alumno', async (req, res) => {
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
        if (estadia.anteproyecto && estadia.avance) {
            infoAlumno.anteproyecto = {
                nombre: estadia.anteproyecto.datosProyecto.nombre,
                objetivo: estadia.anteproyecto.datosProyecto.objetivo,
                nombre: estadia.anteproyecto.datosProyecto.descripcion,
                asesorEmpresarial: estadia.anteproyecto.datosEmpresa.nombreEmpresario
            };
            infoAlumno.avance = estadia.avance
        } else {
            infoAlumno.anteproyecto = "Aun no ha sido iniciado";
            infoAlumno.avance = "Aun no hay ningun avance"
        }
        res.json(infoAlumno);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH - Subir avance / modificar etapa
router.patch('/alumno/avance/', async (req, res) => {
    try {
        const etapa = req.body.etapa;
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);
        estadia.avance[etapa].nombre = req.body[etapa].nombre || estadia.avance[etapa].nombre;
        estadia.avance[etapa].motivo = req.body[etapa].motivo || estadia.avance[etapa].motivo;
        estadia.avance[etapa].fecha = new Date(req.body[etapa].fecha) || estadia.avance[etapa].fecha;
        const updatedEstadia = await estadia.save();
        res.json(updatedEstadia);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;