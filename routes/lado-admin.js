const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const path = require('path');

const ExcelJS = require('exceljs');

const bcrypt = require('bcrypt');

const Estadia = require('../models/estadia');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');
const Vinculador = require('../models/vinculador');

/* Alumnos */

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
        if (alumnos.length === 0 || alumnos === null) {
            return res.json("No se encontraron alumnos");
        }
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Generar excel de alumnos en proceso de estadias (filtrados por nivel academico, carrera o area)
router.post('/alumnos/proceso/excel', async (req, res) => {
    try {
        let alumnos = [];
        const filtro = req.body.filtro
        if (filtro.buscador) {
            return res.status(500).json({ message: "No se puede generar un archivo de Excel para un solo alumno." });
        }
        const estadias = await Estadia.find();
        for (const estadia of estadias) {
            if (!estadia.documentos || !estadia.documentos.cta || estadia.documentos.cta.estado.nombre !== "Aceptada") {
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
        }
        if (alumnos.length === 0 || alumnos === null) {
            return res.json("No se encontraron alumnos");
        }
        const data = alumnos;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        worksheet.columns = [
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido paterno', key: 'apPaterno' },
            { header: 'Apellido materno', key: 'apMaterno' },
            { header: 'Matricula', key: 'matricula' },
            { header: 'Nivel academico', key: 'nivelAcademico' },
            { header: 'Carrera', key: 'carrera' },
            { header: 'Area', key: 'area' },
        ];

        data.forEach((row) => {
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=alumnos-en-proceso.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Generar Excel de alumnos liberados del proceso de estadias
router.post('/alumnos/liberados/excel', async (req, res) => {
    try {
        let alumnos = [];
        const filtro = req.body.filtro
        const busqueda = {}
        if (filtro.buscador) {
            return res.status(500).json({ message: "No se puede generar un archivo de Excel para un solo alumno." });
        }
        if (filtro.año) {
            busqueda["cartaPresentacion.datosAcademicos.año"] = filtro.año;
        }
        if (filtro.periodo) {
            busqueda["cartaPresentacion.datosAcademicos.periodo"] = filtro.periodo;
        }
        const estadias = await Estadia.find(busqueda);
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
        if (alumnos.length === 0 || alumnos === null) {
            return res.json("No se encontraron alumnos");
        }
        const data = alumnos;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        worksheet.columns = [
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido paterno', key: 'apPaterno' },
            { header: 'Apellido materno', key: 'apMaterno' },
            { header: 'Matricula', key: 'matricula' },
            { header: 'Nivel academico', key: 'nivelAcademico' },
            { header: 'Carrera', key: 'carrera' },
            { header: 'Area', key: 'area' },
        ];

        data.forEach((row) => {
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=alumnos-liberados.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Busqueda de alumnos liberados del proceso de estadias
router.post('/alumnos/liberados', async (req, res) => {
    try {
        let alumnos = [];
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
        if (alumnos.length === 0 || alumnos === null) {
            return res.json("No se encontraron alumnos");
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
        if (alumnos.length === 0 || alumnos === null) {
            return res.json("No se encontraron alumnos");
        }
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Generar Excel de historial de alumnos
router.post('/alumnos/historial/excel', async (req, res) => {
    try {
        let alumnos = [];
        const filtro = req.body.filtro;
        const busqueda = {}
        if (filtro.buscador) {
            return res.status(500).json({ message: "No se puede generar un archivo de Excel para un solo alumno." });
        }
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
        if (alumnos.length === 0 || alumnos === null) {
            return res.json("No se encontraron alumnos");
        }

        const data = alumnos;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        worksheet.columns = [
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido paterno', key: 'apPaterno' },
            { header: 'Apellido materno', key: 'apMaterno' },
            { header: 'Matricula', key: 'matricula' },
            { header: 'Nivel academico', key: 'nivelAcademico' },
            { header: 'Carrera', key: 'carrera' },
            { header: 'Area', key: 'area' },
        ];

        data.forEach((row) => {
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=alumnos-liberados.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* Perfil Alumno */

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
        if (estadia.anteproyecto) {
            infoAlumno.anteproyecto = estadia.anteproyecto;
        }
        if (estadia.avance) {
            infoAlumno.avance = estadia.avance;
        }
        if (estadia.documentos) {
            infoAlumno.documentos = estadia.documentos;
        }
        res.json(infoAlumno);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH - Modificar carta presentacion
router.patch('alumno/perfil/cpa/modificar', async (req, res) => {
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
        const nombres = datosAlumno.nombres;
        estadia.cartaPresentacion.datosAlumno.nombres.nombre = nombres.nombre || estadia.cartaPresentacion.datosAlumno.nombres.nombre;
        estadia.cartaPresentacion.datosAlumno.nombres.apPaterno = nombres.apPaterno || estadia.cartaPresentacion.datosAlumno.nombres.apPaterno;
        estadia.cartaPresentacion.datosAlumno.nombres.apMaterno = nombres.apMaterno || estadia.cartaPresentacion.datosAlumno.nombres.apMaterno;

        const privado = datosAlumno.privado;
        estadia.cartaPresentacion.datosAlumno.privado.matricula = privado.matricula || estadia.cartaPresentacion.datosAlumno.privado.matricula;
        estadia.cartaPresentacion.datosAlumno.privado.email = privado.email || estadia.cartaPresentacion.datosAlumno.privado.email;
        estadia.cartaPresentacion.datosAlumno.telefonoCelular = datosAlumno.telefonoCelular || estadia.cartaPresentacion.datosAlumno.telefonoCelular;
        estadia.cartaPresentacion.datosAlumno.telefonoCasa = datosAlumno.telefonoCasa || estadia.cartaPresentacion.datosAlumno.telefonoCasa;
        estadia.cartaPresentacion.datosAlumno.nss = datosAlumno.nss || estadia.cartaPresentacion.datosAlumno.nss;
        estadia.cartaPresentacion.datosAlumno.curp = datosAlumno.curp || estadia.cartaPresentacion.datosAlumno.curp;

        const datosAcademicos = cpa.datosAcademicos;
        const datosAcademicosAlumno = cpa.datosAcademicosAlumno;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.idCarrera = datosAcademicosAlumno.idCarrera || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.idCarrera;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.nivelAcademico = datosAcademicosAlumno.nivelAcademico || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.nivelAcademico;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.turno = datosAcademicosAlumno.turno || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.turno;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.carrera = datosAcademicos.carrera || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.carrera;
        estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.area = datosAcademicos.area || estadia.cartaPresentacion.datosAcademicos.datosAcademicosAlumno.area;
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

// PATCH - Modificar un anteproyecto
router.patch('/alumno/perfil/anteproyecto/modificar', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);

        const anteproyecto = req.body.anteproyecto;

        const datosEmpresa = anteproyecto.datosEmpresa;
        estadia.anteproyecto.datosEmpresa.emailEmpresario = datosEmpresa.emailEmpresario || estadia.anteproyecto.datosEmpresa.emailEmpresario;
        estadia.anteproyecto.datosEmpresa.telefonoEmpresario = datosEmpresa.telefonoEmpresario || estadia.anteproyecto.datosEmpresa.telefonoEmpresario;

        const datosProyecto = anteproyecto.datosProyecto;
        estadia.anteproyecto.datosProyecto.nombre = datosProyecto.nombre || estadia.anteproyecto.datosProyecto.nombre;
        estadia.anteproyecto.datosProyecto.objetivo = datosProyecto.objetivo || estadia.anteproyecto.datosProyecto.objetivo;
        estadia.anteproyecto.datosProyecto.descripcion = datosProyecto.descripcion || estadia.anteproyecto.datosProyecto.descripcion;

        estadia.anteproyecto.estado.nombre = anteproyecto.estado.nombre || estadia.anteproyecto.estado.nombre;
        estadia.anteproyecto.estado.motivo = anteproyecto.estado.motivo || estadia.anteproyecto.estado.motivo;
        estadia.anteproyecto.estado.fecha = anteproyecto.estado.fecha || estadia.anteproyecto.estado.fecha;

        estadia.anteproyecto.fechaRegistro = anteproyecto.fechaRegistro || estadia.anteproyecto.fechaRegistro;
        const updatedAnteproyecto = await estadia.save();
        res.json(updatedAnteproyecto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST - Ver/descargar documento
router.post('alumno/perfil/documento/descargar', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const nombreDocumento = req.body.nombreDocumento;
        const pathDocumento = req.body.pathDocumento;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);

        if (estadia && estadia.documentos) {
            const documento = estadia.documentos[nombreDocumento];
            if (documento && documento.path === pathDocumento) {
                const filePath = path.join(__dirname, '../documents', pathDocumento);
                return res.sendFile(filePath);
            }
        }

        return res.json("No se encontro documento");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* Asesores */

// POST - Busqueda de todos los asesores
router.post('/asesores', async (req, res) => {
    try {
        const filtro = req.body.filtro;
        const busqueda = {};
        if (filtro.buscador) {
            const textoBusqueda = filtro.buscador;
            const regex = new RegExp(textoBusqueda, 'i');
            busqueda.$or = [
                { 'datosPersonales.nombres.nombre': regex },
                { 'datosPersonales.nombres.apPaterno': regex },
                { 'datosPersonales.nombres.apMaterno': regex }
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
        if (filtro.carrera) {
            busqueda["datosAcademicos.carrera"] = filtro.carrera;
        }
        if (filtro.area) {
            busqueda["datosAcademicos.area"] = filtro.area;
        }
        const asesores = await Asesor.find(busqueda);
        let arrAsesores = [];
        for (const asesor of asesores) {
            const infoAsesor = {
                idAsesor: asesor._id,
                nombre: asesor.datosPersonales.nombres.nombre,
                apPaterno: asesor.datosPersonales.nombres.apPaterno,
                apMaterno: asesor.datosPersonales.nombres.apMaterno,
                carrera: asesor.datosAcademicos.carrera,
                email: asesor.datosPersonales.privado.email,
                password: asesor.datosPersonales.privado.password,
                username: asesor.datosPersonales.privado.username,
                estado: asesor.estado
            }
            arrAsesores.push(infoAsesor);
        }
        res.json(arrAsesores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Busqueda de todos los asesores
router.post('/asesores/excel', async (req, res) => {
    try {
        const filtro = req.body.filtro;
        const busqueda = {};
        if (filtro.buscador) {
            const textoBusqueda = filtro.buscador;
            const regex = new RegExp(textoBusqueda, 'i');
            busqueda.$or = [
                { 'datosPersonales.nombres.nombre': regex },
                { 'datosPersonales.nombres.apPaterno': regex },
                { 'datosPersonales.nombres.apMaterno': regex }
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
        if (filtro.carrera) {
            busqueda["datosAcademicos.carrera"] = filtro.carrera;
        }
        if (filtro.area) {
            busqueda["datosAcademicos.area"] = filtro.area;
        }
        const asesores = await Asesor.find(busqueda);
        let arrAsesores = [];
        for (const asesor of asesores) {
            const infoAsesor = {
                idAsesor: asesor._id,
                nombre: asesor.datosPersonales.nombres.nombre,
                apPaterno: asesor.datosPersonales.nombres.apPaterno,
                apMaterno: asesor.datosPersonales.nombres.apMaterno,
                carrera: asesor.datosAcademicos.carrera,
                email: asesor.datosPersonales.privado.email,
                password: asesor.datosPersonales.privado.password,
                username: asesor.datosPersonales.privado.username,
                estado: asesor.estado
            }
            arrAsesores.push(infoAsesor);
        }

        const data = arrAsesores;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        worksheet.columns = [
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido paterno', key: 'apPaterno' },
            { header: 'Apellido materno', key: 'apMaterno' },
            { header: 'Carrera', key: 'carrera' },
            { header: 'Estado', key: 'estado'}
        ];

        data.forEach((row) => {
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=alumnos-liberados.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Crear nuevo asesor
router.post('/asesores/crear', async (req, res) => {
    try {
        const password = req.body.asesor.datosPersonales.privado.password;

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                throw new Error('Error al generar el hash de la contraseña');
            }

            const asesor = new Asesor({
                estado: req.body.asesor.estado,
                datosPersonales: {
                    nombres: {
                        nombre: req.body.asesor.datosPersonales.nombres.nombre,
                        apPaterno: req.body.asesor.datosPersonales.nombres.apPaterno,
                        apMaterno: req.body.asesor.datosPersonales.nombres.apMaterno
                    },
                    privado: {
                        email: req.body.asesor.datosPersonales.privado.email,
                        telefono: req.body.asesor.datosPersonales.privado.telefono,
                        username: req.body.asesor.datosPersonales.privado.username,
                        password: hash
                    }
                },
                datosAcademicos: {
                    carrera: req.body.asesor.datosAcademicos.carrera
                },
                fechaRegistro: new Date(req.body.asesor.fechaRegistro)
            });

            const newAsesor = await asesor.save();
            res.status(201).json(newAsesor);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST - Perfil de asesor (informacion general)
router.post('/asesor/perfil', async (req, res) => {
    try {
        const idAsesor = req.body.asesor;
        const asesor = await Asesor.findById(idAsesor);
        res.json(asesor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/asesor/perfil/modificar', async (req, res) => {
    try {
        const idAsesor = req.body.asesor.idAsesor;
        const asesor = await Asesor.findById(idAsesor);

        const newPassword = req.body.asesor.datosPersonales.privado.password;
        const currentPassword = asesor.datosPersonales.privado.password;

        if (newPassword && newPassword !== currentPassword) {
            bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err) {
                    throw new Error('Error al generar el hash de la contraseña');
                }
                asesor.datosPersonales.privado.password = hash;
                await saveAsesor(asesor, res, req.body);
            });
        } else {
            await saveAsesor(asesor, res, req.body);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function saveAsesor(asesor, res, body) {
    try {
        asesor.estado = body.asesor.estado || asesor.estado;

        asesor.datosPersonales.nombres.nombre = body.asesor.datosPersonales.nombres.nombre || asesor.datosPersonales.nombres.nombre;
        asesor.datosPersonales.nombres.apPaterno = body.asesor.datosPersonales.nombres.apPaterno || asesor.datosPersonales.nombres.apPaterno;
        asesor.datosPersonales.nombres.apMaterno = body.asesor.datosPersonales.nombres.apMaterno || asesor.datosPersonales.nombres.apMaterno;

        asesor.datosPersonales.privado.email = body.asesor.datosPersonales.privado.email || asesor.datosPersonales.privado.email;
        asesor.datosPersonales.privado.telefono = body.asesor.datosPersonales.privado.telefono || asesor.datosPersonales.privado.telefono;
        asesor.datosPersonales.privado.username = body.asesor.datosPersonales.privado.username || asesor.datosPersonales.privado.username;

        asesor.datosAcademicos.carrera = body.asesor.datosAcademicos.carrera || asesor.datosAcademicos.carrera;

        const newAsesor = await asesor.save();
        res.status(201).json(newAsesor);
    } catch (error) {
        throw new Error('Error al guardar el asesor');
    }
}

// DELETE - Borrar asesor
router.post('/asesor/perfil/borrar', async (req, res) => {
    try {
        const idAsesor = req.body.asesor;
        const asesor = await Asesor.findByIdAndDelete(idAsesor);
        if (asesor) {
            return res.status(202).json("Asesor eliminado correctamente");
        }
        res.status(204).json();
    } catch (error) {
        res.status(204).json({ message: error.message });
    }
});


// POST - Perfil asesor, alumnos asesorados
router.post('/asesor/perfil/alumnos', async (req, res) => {
    try {
        const idAsesor = req.body.idAsesor;
        let alumnos = [];
        const estadias = await Estadia.find({
            idAsesor: new ObjectId(idAsesor)
        });
        for (const estadia of estadias) {
            const idAlumno = estadia._doc.idAlumno;
            const busqueda = {
                _id: new ObjectId(idAlumno)
            };
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

// POST - Perfil asesor, agregar alumno para asesorar
router.post('/asesor/perfil/alumno/buscar', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;

        const estadia = await Estadia.findOne({
            idAlumno: new ObjectId(idAlumno)
        });

        if (!estadia) {
            return res.json("Alumno no encontrado");
        }
        if (!estadia.idAsesor || estadia.idAsesor == null) { // Si el idAsesor esta vacio
            return res.json("Alumno sin asesor")
        } else {
            const asesor = await Estadia.findById(estadia.idAsesor);
            const nombre = asesor.datosPersonales.nombres.nombre;
            const apPaterno = asesor.datosPersonales.nombres.apPaterno;
            const apMaterno = asesor.datosPersonales.nombres.apMaterno;
            const nombreCompleto = `${nombre} ${apPaterno} ${apMaterno}`;
            const respuesta = {
                mensaje: "Alumno con asesor",
                asesor: nombreCompleto
            }
            return res.json(respuesta);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.patch('/asesor/perfil/alumno/asignar', async (req, res) => {
    try {
        const idAsesor = req.body.idAsesor;
        const idAlumno = req.body.idAlumno;

        const estadia = await Estadia.findOne({
            idAlumno: new ObjectId(idAlumno)
        });
        estadia.idAsesor ??= {}; // Si el alumno no tiene idAsesor 
        estadia.idAsesor = new ObjectId(idAsesor) || estadia.idAsesor;
        const newAsesor = estadia.save();
        res.json(newAsesor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* Vinculacion */

// POST - Crear nuevo vinculador
router.post('/vinculador/crear', async (req, res) => {
    try {
        const password = req.body.vinculador.datosPersonales.privado.password;

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                throw new Error('Error al generar el hash de la contraseña');
            }
            const vinculador = new Vinculador({
                estado: req.body.vinculador.estado,
                datosPersonales: {
                    nombres: {
                        nombre: req.body.vinculador.datosPersonales.nombres.nombre,
                        apPaterno: req.body.vinculador.datosPersonales.nombres.apPaterno,
                        apMaterno: req.body.vinculador.datosPersonales.nombres.apMaterno
                    },
                    privado: {
                        email: req.body.vinculador.datosPersonales.privado.email,
                        username: req.body.vinculador.datosPersonales.privado.username,
                        password: hash
                    }
                },
                fechaRegistro: new Date(req.body.vinculador.fechaRegistro)
            });
            const newVinculador = await vinculador.save();
            res.status(201).json(newVinculador);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST - Perfil de vinculador (informacion general)
router.post('/vinculador/perfil', async (req, res) => {
    try {
        const idVinculador = req.body.asesor;
        const vinculador = await Vinculador.findById(idVinculador);
        res.json(vinculador);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/vinculador/perfil/modificar', async (req, res) => {
    try {
        const idVinculador = req.body.vinculador.idAsesor;
        const vinculador = await Vinculador.findById(idVinculador);

        const newPassword = req.body.vinculador.datosPersonales.privado.password;
        const currentPassword = vinculador.datosPersonales.privado.password;

        if (newPassword && newPassword !== currentPassword) {
            bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err) {
                    throw new Error('Error al generar el hash de la contraseña');
                }
                vinculador.datosPersonales.privado.password = hash;
                await saveVinculador(vinculador, res, req.body);
            });
        } else {
            await saveVinculador(vinculador, res, req.body);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function saveVinculador(vinculador, res, body) {
    try {
        vinculador.estado = body.vinculador.estado || vinculador.estado;

        vinculador.datosPersonales.nombres.nombre = body.vinculador.datosPersonales.nombres.nombre || vinculador.datosPersonales.nombres.nombre;
        vinculador.datosPersonales.nombres.apPaterno = body.vinculador.datosPersonales.nombres.apPaterno || vinculador.datosPersonales.nombres.apPaterno;
        vinculador.datosPersonales.nombres.apMaterno = body.vinculador.datosPersonales.nombres.apMaterno || vinculador.datosPersonales.nombres.apMaterno;

        vinculador.datosPersonales.privado.email = body.vinculador.datosPersonales.privado.email || vinculador.datosPersonales.privado.email;
        vinculador.datosPersonales.privado.username = body.vinculador.datosPersonales.privado.username || vinculador.datosPersonales.privado.username;

        const newVinculador = await vinculador.save();
        res.status(201).json(newVinculador);
    } catch (error) {
        throw new Error('Error al guardar el asesor');
    }
}

// DELETE - Borrar asesor
router.post('/vinculador/perfil/borrar', async (req, res) => {
    try {
        const idVinculador = req.body.vinculador;
        const vinculador = await Vinculador.findByIdAndDelete(idVinculador);
        if (vinculador) {
            return res.status(202).json("Vinculador eliminado correctamente");
        }
        res.status(204).json();
    } catch (error) {
        res.status(204).json({ message: error.message });
    }
});

module.exports = router;