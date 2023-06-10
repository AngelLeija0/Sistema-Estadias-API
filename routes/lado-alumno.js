const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const Estadia = require('../models/estadia');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');

/* Carta Presentacion */

// POST - Ver informacion y estado de la carta presentacion
router.post('/cpa', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);

        if (estadia != null || estadia != {}) {
            const infoCPA = {
                estado: {
                    nombre: estadia.cartaPresentacion.estado.nombre,
                    motivo: estadia.cartaPresentacion.estado.motivo,
                    fecha: estadia.cartaPresentacion.estado.motivo
                },
                datosAlumno: {
                    nombres: {
                        nombre: estadia.cartaPresentacion.datosAlumno.nombres.nombre,
                        apPaterno: estadia.cartaPresentacion.datosAlumno.nombres.apPaterno,
                        apMaterno: estadia.cartaPresentacion.datosAlumno.nombres.apMaterno
                    },
                    privado: {
                        matricula: estadia.cartaPresentacion.datosAlumno.privado.matricula,
                        email: estadia.cartaPresentacion.datosAlumno.privado.email
                    },
                    telfonoCelular: estadia.cartaPresentacion.datosAlumno.telfonoCelular,
                    telfonoCasa: estadia.cartaPresentacion.datosAlumno.telfonoCasa,
                    nss: estadia.cartaPresentacion.datosAlumno.nss,
                    curp: estadia.cartaPresentacion.datosAlumno.curp
                },
                datosAcademicos: {
                    datosAcademicosAlumno: {
                        nivelAcademico: estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.nivelAcademico,
                        turno: estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.turno,
                        carrera: estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.carrera,
                        area: estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.area,
                        grado: estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grupo,
                        grupo: estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grado
                    },
                    perido: estadia.cartaPresentacion.datosAcademicos.perido,
                    año: estadia.cartaPresentacion.datosAcademicos.año
                },
                datosEmpresa: {
                    nombreEmpresa: estadia.cartaPresentacion.datosEmpresa.nombreEmpresa,
                    nombreEmpresario: estadia.cartaPresentacion.datosEmpresa.nombreEmpresario,
                    puestoEmpresario: estadia.cartaPresentacion.datosEmpresa.puestoEmpresario
                },
                fechaRegistro: estadia.cartaPresentacion.fechaRegistro
            };
            res.json(infoCPA);
        } else {
            res.json("No se encontro ninguna carta presentacion");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Crear una nueva carta presentacion
router.post('/cpa/crear', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const cpa = {
            estado: {
                nombre: req.body.estado.nombre,
                motivo: req.body.estado.motivo,
                fecha: new Date(req.body.estado.fecha)
            },
            datosAlumno: {
                nombres: {
                    nombre: req.body.datosAlumno.nombres.nombre,
                    apPaterno: req.body.datosAlumno.nombres.apMaterno,
                    apMaterno: req.body.datosAlumno.nombres.apMaterno
                },
                privado: {
                    matricula: req.body.datosAlumno.privado.matricula,
                    email: req.body.datosAlumno.privado.email
                },
                telfonoCelular: req.body.datosAlumno.telfonoCelular,
                telfonoCasa: req.body.datosAlumno.telfonoCasa,
                nss: req.body.datosAlumno.nss,
                curp: req.body.datosAlumno.curp
            },
            datosAcademicos: {
                datosAcademicosAlumno: {
                    nivelAcademico: req.body.datosAcademicos.nivelAcademico,
                    turno: req.body.datosAcademicos.turno,
                    carrera: req.body.datosAcademicos.carrera,
                    area: req.body.datosAcademicos.area,
                    grado: req.body.datosAcademicos.grado,
                    grupo: req.body.datosAcademicos.grupo
                },
                perido: req.body.datosAcademicos.perido,
                año: req.body.datosAcademicos.año
            },
            datosEmpresa: {
                nombreEmpresa: req.body.datosEmpresa.nombreEmpresa,
                nombreEmpresario: req.body.datosEmpresa.nombreEmpresario,
                puestoEmpresario: req.body.datosEmpresa.puestoEmpresario
            },
            fechaRegistro: new Date(req.body.fechaRegistro)
        }
        const objEstadia = {
            idAlumno: new ObjectId(idAlumno),
            cartaPresentacion: cpa
        }
        const estadia = new Estadia(objEstadia);
        const newEstadia = estadia.save();
        res.status(201).json(newEstadia);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH - Modificar carta presentacion
router.patch('/cpa/modificar', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);

        const cpa = req.body;
        estadia.cartaPresentacion.estado.nombre = cpa.estado.nombre || estadia.cartaPresentacion.estado.nombre;
        estadia.cartaPresentacion.estado.motivo = cpa.estado.motivo || estadia.cartaPresentacion.estado.motivo;
        estadia.cartaPresentacion.estado.fecha = cpa.estado.fecha || estadia.cartaPresentacion.estado.fecha;

        const datosAlumno = cpa.datosAlumno;
        const datosAlumnoAlumno = datosAlumno.datosAlumno;

        const nombres = datosAlumnoAlumno.nombres;
        estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.nombre = nombres.nombre || estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.nombre;
        estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apPaterno = nombres.apPaterno || estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apPaterno;
        estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apMaterno = nombres.apMaterno || estadia.cartaPresentacion.datosAlumno.datosAlumno.nombres.apMaterno;

        const privado = datosAlumnoAlumno.privado;
        estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.matricula = privado.matricula || estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.matricula;
        estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.email = privado.email || estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.email;
        estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.password = privado.password || estadia.cartaPresentacion.datosAlumno.datosAlumno.privado.password;
        estadia.cartaPresentacion.telefonoCelular = datosAlumno.telefonoCelular || estadia.cartaPresentacion.telefonoCelular;
        estadia.cartaPresentacion.telefonoCasa = datosAlumno.telefonoCasa || estadia.cartaPresentacion.telefonoCasa;
        estadia.cartaPresentacion.nss = datosAlumno.nss || estadia.cartaPresentacion.nss;
        estadia.cartaPresentacion.curp = datosAlumno.curp || estadia.cartaPresentacion.curp;

        const datosAcademicos = cpa.datosAcademicos;
        const datosAcademicosAlumno = cpa.datosAcademicosAlumno;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.idCarrera = datosAcademicosAlumno.idCarrera || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.idCarrera;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grado = datosAcademicosAlumno.grado || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grado;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grupo = datosAcademicosAlumno.grupo || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.grupo;
        estadia.cartaPresentacion.datosAcademicos.periodo = datosAcademicos.periodo || estadia.cartaPresentacion.datosAcademicos.periodo;
        estadia.cartaPresentacion.datosAcademicos.año = datosAcademicos.año || estadia.cartaPresentacion.datosAcademicos.año;

        const datosEmpresa = cpa.datosEmpresa;
        estadia.cartaPresentacion.datosEmpresa.nombreEmpresa = datosEmpresa.nombreEmpresa || estadia.cartaPresentacion.datosEmpresa.nombreEmpresa;
        estadia.cartaPresentacion.datosEmpresa.nombreEmpresario = datosEmpresa.nombreEmpresario || estadia.cartaPresentacion.datosEmpresa.nombreEmpresario;
        estadia.cartaPresentacion.datosEmpresa.puestoEmpresario = datosEmpresa.puestoEmpresario || estadia.cartaPresentacion.datosEmpresa.puestoEmpresario;

        const updatedEstadia = await estadia.save();
        res.json(updatedEstadia);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/* Seguimiento Administrativo */

// POST - Subir documento  y/o actualizar documento
router.post('/documento/subir', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const reqDocumentos = req.body.documentos;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);
        if (estadia.documentos === null || estadia.documentos === undefined) {
            estadia.documentos = {};
        }
        Object.keys(reqDocumentos).map((key) => {
            estadia.documentos[key] = {
                archivo: reqDocumentos[key].archivo || estadia.documentos[key].archivo,
                estado: {
                    nombre: reqDocumentos[key].estado.nombre || estadia.documentos[key].estado.nombre,
                    motivo: reqDocumentos[key].estado.motivo || estadia.documentos[key].estado.motivo,
                    fecha: reqDocumentos[key].estado.fecha || estadia.documentos[key].estado.fecha
                }
            }
        });
        const updatedDocumento = await estadia.save();
        res.json(updatedDocumento);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* Seguimiento Academico  */

// POST - Crear un anteproyecto
router.post('academico/anteproyecto/crear', async (req, res) => {
    try {
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;