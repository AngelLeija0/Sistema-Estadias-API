const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const ExcelJS = require('exceljs');

const Estadia = require('../models/estadia');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');
const alumno = require('../models/alumno');

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
        if (alumnos.length === 0 || alumnos === null){
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
        if (alumnos.length === 0 || alumnos === null){
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
        if (filtro.buscador){
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
        if (alumnos.length === 0 || alumnos === null){
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
        if (alumnos.length === 0 || alumnos === null){
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
        if (alumnos.length === 0 || alumnos === null){
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
        if (filtro.buscador){
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
        if (alumnos.length === 0 || alumnos === null){
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

/* Asesores */

// POST - Busqueda de todos los asesores
router.post('/asesores', async (req, res) => {
    try {
        let asesores = [];
        const filtro = req.body.filtro
        const estadias = await Estadia.find();
        for (const estadia of estadias) {
            const idAsesor = estadia._doc.idAsesor;
            const busqueda = {
                _id: new ObjectId(idAsesor)
            };
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
            if (filtro.nivelAcademico) {
                busqueda["datosAcademicos.nivelAcademico"] = filtro.nivelAcademico;
            }
            if (filtro.carrera) {
                busqueda["datosAcademicos.carrera"] = filtro.carrera;
            }
            if (filtro.area) {
                busqueda["datosAcademicos.area"] = filtro.area;
            }
            const asesor = await Asesor.findOne(busqueda);
            if (asesor) {
                const infoAsesor = {
                    idAsesor: idAsesor,
                    nombre: asesor.datosPersonales.nombres.nombre,
                    apPaterno: asesor.datosPersonales.nombres.apPaterno,
                    apMaterno: asesor.datosPersonales.nombres.apMaterno,
                    nivelAcademico: asesor.datosAcademicos.nivelAcademico,
                    carrera: asesor.datosAcademicos.carrera,
                    area: asesor.datosAcademicos.area
                };
                asesores.push(infoAsesor);
            }
        }
        res.json(asesores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Busqueda de todos los asesores
router.post('/asesores/excel', async (req, res) => {
    try {
        let asesores = [];
        const filtro = req.body.filtro;
        if (filtro.buscador) {
            return res.status(500).json({ message: "No se puede generar un archivo de Excel para un solo alumno." });
        }
        const estadias = await Estadia.find();
        for (const estadia of estadias) {
            const idAsesor = estadia._doc.idAsesor;
            const busqueda = {
                _id: new ObjectId(idAsesor)
            };
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
            if (filtro.nivelAcademico) {
                busqueda["datosAcademicos.nivelAcademico"] = filtro.nivelAcademico;
            }
            if (filtro.carrera) {
                busqueda["datosAcademicos.carrera"] = filtro.carrera;
            }
            if (filtro.area) {
                busqueda["datosAcademicos.area"] = filtro.area;
            }
            const asesor = await Asesor.findOne(busqueda);
            if (asesor) {
                const infoAsesor = {
                    idAsesor: idAsesor,
                    nombre: asesor.datosPersonales.nombres.nombre,
                    apPaterno: asesor.datosPersonales.nombres.apPaterno,
                    apMaterno: asesor.datosPersonales.nombres.apMaterno,
                    nivelAcademico: asesor.datosAcademicos.nivelAcademico,
                    carrera: asesor.datosAcademicos.carrera,
                    area: asesor.datosAcademicos.area
                };
                asesores.push(infoAsesor);
            }
        }
        const data = asesores;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        worksheet.columns = [
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido paterno', key: 'apPaterno' },
            { header: 'Apellido materno', key: 'apMaterno' },
            { header: 'Carrera', key: 'carrera' }
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
        const asesor = new Asesor({
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
            fechaRegistro: new Date(req.body.fechaRegistro)
        });
        const newAsesor = await asesor.save();
        res.status(201).json(newAsesor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST - Perfil de asesor (informacion general)
router.post('/asesor', async (req, res) => {
    try {
        const idAsesor = req.body.asesor;
        const asesor = await Asesor.findById(idAsesor);
        res.json(asesor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST - Perfil asesor, alumnos asesorados
router.post('/asesor/alumnos', async (req, res) => {
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
router.post('/asesor/alumno/buscar', async (req, res) => {
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
router.patch('/asesor/alumno/asignar', async (req, res) => {
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

module.exports = router;