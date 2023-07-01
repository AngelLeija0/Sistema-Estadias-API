const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const path = require('path');

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

        if (estadia.cartaPresentacion !== null && estadia.cartaPresentacion !== undefined) {
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
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);

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
        estadia.cartaPresentacion = cpa;
        const updatedEstadia = estadia.save();
        res.status(201).json(updatedEstadia);
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

/* Seguimiento Administrativo */

// POST - Subir documento y/o actualizar documento
router.post('/documento/subir', upload.single('archivo'), async (req, res) => {
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

        const archivo = req.file;
        const archivoNombre = archivo ? archivo.originalname : null;

        const destino = path.join(__dirname, '../documents', archivoNombre);
        await fs.rename(archivo.path, destino);

        Object.keys(reqDocumentos).map((key) => {
            estadia.documentos[key] = {
                archivo: archivoNombre || estadia.documentos[key].archivo,
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
        res.status(500).json({ message: error.message });
    }
});

// POST - Ver/descargar documento
router.post('/documento/descargar', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const documentos = estadia.documentos;
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

// POST - Ver estado de documentos
router.post('/documentos', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);
        const documentos = estadia.documentos;
        if (documentos === null && documentos === undefined) {
            const infoDocumentos = {}
            if (documentos.curriculum) {
                infoDocumentos.curriculum = {
                    archivo: documentos.curriculum.archivo,
                    estado: {
                        nombre: documentos.curriculum.estado.nombre,
                        motivo: documentos.curriculum.estado.motivo,
                        fecha: documentos.curriculum.estado.fecha
                    }
                }
            }
            if (documentos.nss) {
                infoDocumentos.nss = {
                    archivo: documentos.nss.archivo,
                    estado: {
                        nombre: documentos.nss.estado.nombre,
                        motivo: documentos.nss.estado.motivo,
                        fecha: documentos.nss.estado.fecha
                    }
                }
            }
            if (documentos.cpa) {
                infoDocumentos.cpa = {
                    archivo: documentos.cpa.archivo,
                    estado: {
                        nombre: documentos.cpa.estado.nombre,
                        motivo: documentos.cpa.estado.motivo,
                        fecha: documentos.cpa.estado.fecha
                    }
                }
            }
            if (documentos.caa) {
                infoDocumentos.caa = {
                    archivo: documentos.caa.archivo,
                    estado: {
                        nombre: documentos.caa.estado.nombre,
                        motivo: documentos.caa.estado.motivo,
                        fecha: documentos.caa.estado.fecha
                    }
                }
            }
            if (documentos.reporte) {
                infoDocumentos.reporte = {
                    archivo: documentos.reporte.archivo,
                    estado: {
                        nombre: documentos.reporte.estado.nombre,
                        motivo: documentos.reporte.estado.motivo,
                        fecha: documentos.reporte.estado.fecha
                    }
                }
            }
            if (documentos.rubrica) {
                infoDocumentos.rubrica = {
                    archivo: documentos.rubrica.archivo,
                    estado: {
                        nombre: documentos.rubrica.estado.nombre,
                        motivo: documentos.rubrica.estado.motivo,
                        fecha: documentos.rubrica.estado.fecha
                    }
                }
            }
            if (documentos.dictamen) {
                infoDocumentos.dictamen = {
                    archivo: documentos.dictamen.archivo,
                    estado: {
                        nombre: documentos.dictamen.estado.nombre,
                        motivo: documentos.dictamen.estado.motivo,
                        fecha: documentos.dictamen.estado.fecha
                    }
                }
            }
            if (documentos.protesta) {
                infoDocumentos.protesta = {
                    archivo: documentos.protesta.archivo,
                    estado: {
                        nombre: documentos.protesta.estado.nombre,
                        motivo: documentos.protesta.estado.motivo,
                        fecha: documentos.protesta.estado.fecha
                    }
                }
            }
            if (documentos.cta) {
                infoDocumentos.cta = {
                    archivo: documentos.cta.archivo,
                    estado: {
                        nombre: documentos.cta.estado.nombre,
                        motivo: documentos.cta.estado.motivo,
                        fecha: documentos.cta.estado.fecha
                    }
                }
            }
            res.json(infoDocumentos);
        } else {
            res.json("No se encontraron documentos");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* Seguimiento Academico  */

// POST - Ver informacion y estado de anteprocto
router.get('/academico/anteproyecto', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);
        const anteproyecto = estadia.anteproyecto;

        if (anteproyecto !== null && anteproyecto !== undefined) {
            const infoAnteproyecto = {
                datosEmpresa: {
                    nombreEmpresa: anteproyecto.datosEmpresa.nombreEmpresa,
                    emailEmpresario: anteproyecto.datosEmpresa.emailEmpresario,
                    telefonoEmpresario: anteproyecto.datosEmpresa.telefonoEmpresario
                },
                datosProyecto: {
                    nombre: anteproyecto.datosProyecto.nombre,
                    objetivo: anteproyecto.datosProyecto.objetivo,
                    descripcion: anteproyecto.datosProyecto.descripcion
                },
                estado: {
                    nombre: anteproyecto.estado.nombre,
                    motivo: anteproyecto.estado.motivo,
                    fecha: anteproyecto.estado.fecha
                },
                fechaRegistro: anteproyecto.fechaRegistro
            }
            res.json(infoAnteproyecto);
        } else {
            res.json("No se encontro ningun anteproyecto")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Buscar asesores
router.post('/academico/anteproyecto/asesores', async (req, res) => {
    try {
        const carrera = req.body.carrera;
        const asesor = await Asesor.find({
            "datosAcademicos.carrera": carrera
        });
        res.json(asesor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST - Asignar asesor
router.post('/academico/anteproyecto/asesor/asignar', async (req, res) => {
    try {
        const idAsesor = req.body.idAsesor;
        const idAlumno = req.body.idAlumno;

        const estadia = await Estadia.find({
            idAlumno: ObjectId(idAlumno)
        });
        estadia.idAsesor = ObjectId(idAsesor) || estadia.idAsesor;
        res.status(201).json(estadia);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// POST - Crear un anteproyecto
router.post('/academico/anteproyecto/crear', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);

        estadia.anteproyecto = {
            datosEmpresa: {
                nombreEmpresa: req.body.anteproyecto.datosEmpresa.nombreEmpresa,
                emailEmpresario: req.body.anteproyecto.datosEmpresa.emailEmpresario,
                telefonoEmpresario: req.body.anteproyecto.datosEmpresa.telefonoEmpresario
            },
            datosProyecto: {
                nombre: req.body.anteproyecto.datosProyecto.nombre,
                objetivo: req.body.anteproyecto.datosProyecto.objetivo,
                descripcion: req.body.anteproyecto.datosProyecto.descripcion
            },
            estado: {
                nombre: req.body.anteproyecto.estado.nombre,
                motivo: req.body.anteproyecto.estado.motivo,
                fecha: req.body.anteproyecto.estado.fecha
            },
            fechaRegistro: req.body.anteproyecto.fechaRegistro
        }
        const newAnteproyecto = await estadia.save();
        res.status(201).json(newAnteproyecto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH - Modificar un anteproyecto
router.patch('/academico/anteproyecto/modificar', async (req, res) => {
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

// POST - Ver informacion y estado de Avance
router.get('/academico/avance', async (req, res) => {
    try {
        const idAlumno = req.body.idAlumno;
        const filtro = {
            idAlumno: new ObjectId(idAlumno)
        }
        const estadia = await Estadia.findOne(filtro);
        const avance = estadia.avance;

        if (avance !== null && avance !== undefined) {
            console.log("entra al if");
            const infoAvance = {
                progreso: avance.progreso,
                etapa1: {
                    nombre: avance.etapa1.nombre,
                    motivo: avance.etapa1.motivo,
                    fecha: avance.etapa1.fecha
                },
            }
            if (avance.etapa2) {
                infoAvance.etapa2 = {
                    nombre: avance.etapa2.nombre,
                    motivo: avance.etapa2.motivo,
                    fecha: avance.etapa1.fecha
                }
            }
            if (avance.etapa3) {
                infoAvance.etapa3 = {
                    nombre: avance.etapa3.nombre,
                    motivo: avance.etapa3.motivo,
                    fecha: avance.etapa3.fecha
                }
            }
            if (avance.etapa4) {
                infoAvance.etapa4 = {
                    nombre: avance.etapa4.nombre,
                    motivo: avance.etapa4.motivo,
                    fecha: avance.etapa4.fecha
                }
            }
            if (avance.etapa5) {
                infoAvance.etapa5 = {
                    nombre: avance.etapa5.nombre,
                    motivo: avance.etapa5.motivo,
                    fecha: avance.etapa5.fecha
                }
            }
            res.json(infoAvance);
        } else {
            res.json("No se encontro ningun avance")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;