const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { promisify } = require('util');
const compareAsync = promisify(bcrypt.compare);

const Administrador = require('../models/administrador');
const Vinculacion = require('../models/vinculador');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');
const Estadia = require('../models/estadia');

router.post('/', async (req, res) => {
    try {
        const usuario = req.body.usuario;
        const password = req.body.password;

        const response = {}

        const alumno = await Alumno.findOne({
            "datosPersonales.privado.matricula": usuario,
            "datosPersonales.privado.password": password
        });
        if (alumno !== null && alumno !== undefined) {
            response.tipoUsuario = "alumno";
            response.id = alumno._id;
            response.nombre = alumno.datosPersonales.nombres.nombre;
            response.apPaterno = alumno.datosPersonales.nombres.apPaterno;
            response.apMaterno = alumno.datosPersonales.nombres.apMaterno;

            const estadia = await Estadia.findOne({
                idAlumno: new ObjectId(alumno._id)
            });
            if (!estadia) {
                const newEstadia = new Estadia({
                    idAlumno: new ObjectId(alumno._id)
                });
                await newEstadia.save();
            }

            return res.json(response);
        }

        const asesor = await Asesor.findOne({
            "datosPersonales.privado.username": usuario
        });
        if (asesor !== null && asesor !== undefined) {
            const isMatch = await compareAsync(password, asesor.datosPersonales.privado.password);
            if (isMatch) {
                response.tipoUsuario = "asesor";
                response.id = asesor._id;
                response.nombre = asesor.datosPersonales.nombres.nombre;
                response.apPaterno = asesor.datosPersonales.nombres.apPaterno;
                response.apMaterno = asesor.datosPersonales.nombres.apMaterno;
                return res.json(response);
            } else {
                return res.status(401).json("Contraseña incorrecta");
            }
        }

        const admin = await Administrador.findOne({
            "datosPersonales.privado.username": usuario,
            "datosPersonales.privado.password": password
        });
        if (admin !== null && admin !== undefined) {
            response.tipoUsuario = "administrador";
            response.id = admin._id;
            response.nombre = admin.datosPersonales.nombres.nombre;
            response.apPaterno = admin.datosPersonales.nombres.apPaterno;
            response.apMaterno = admin.datosPersonales.nombres.apMaterno;
            return res.json(response);
        }

        const vinculacion = await Vinculacion.findOne({
            "datosPersonales.privado.username": usuario,
            "datosPersonales.privado.password": password
        });
        if (vinculacion !== null && vinculacion !== undefined) {
            response.tipoUsuario = "vinculacion";
            response.id = vinculacion._id;
            response.nombre = vinculacion.datosPersonales.nombres.nombre;
            response.apPaterno = vinculacion.datosPersonales.nombres.apPaterno;
            response.apMaterno = vinculacion.datosPersonales.nombres.apMaterno;
            return res.json(response);
        }

        return res.status(404).json("No se encontró ningún usuario");
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



module.exports = router;