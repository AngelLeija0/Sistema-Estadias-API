const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const express = require('express');
const router = express.Router();

const Admin = require('../models/administrador');
const Asesor = require('../models/asesor');
const Alumno = require('../models/alumno');
const administrador = require('../models/administrador');

// POST - Login
router.post('/', async (req, res) => {
    try {
        const usuario = req.body.usuario;
        const password = req.body.password;

        const response = {}

        const alumno = await Alumno.findOne({
            "datosPersonales.privado.matricula": usuario,
            "datosPersonales.privado.password": password
        });
        if(alumno !== null && alumno !== undefined){
            response.id = alumno._id;
            response.nombres.nombre = alumno.datosPersonales.nombres.nombre;
            response.nombres.apPaterno = alumno.datosPersonales.nombres.apPaterno;
            response.nombres.apMaterno = alumno.datosPersonales.nombres.apMaterno;
            return res.json(response);
        }

        const asesor = await Asesor.findOne({
            "datosPersonales.privado.username": usuario,
            "datosPersonales.privado.password": password
        });
        if(asesor !== null && asesor !== undefined){
            response.id = asesor._id;
            response.nombres.nombre = asesor.datosPersonales.nombres.nombre;
            response.nombres.apPaterno = asesor.datosPersonales.nombres.apPaterno;
            response.nombres.apMaterno = asesor.datosPersonales.nombres.apMaterno;
            return res.json(response);
        }

        const admin = await administrador.findOne({
            "datosPersonales.privado.username": usuario,
            "datosPersonales.privado.password": password
        });
        if(admin !== null && admin !== undefined){
            response.id = asesor._id;
            response.nombres.nombre = admin.datosPersonales.nombres.nombre;
            response.nombres.apPaterno = admin.datosPersonales.nombres.apPaterno;
            response.nombres.apMaterno = admin.datosPersonales.nombres.apMaterno;
            return res.json(response);
        }
        res.status(404).json("No se encontro ningun usuario");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;