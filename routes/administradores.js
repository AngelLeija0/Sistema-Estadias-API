const express = require('express');
const router = express.Router();
const Administrador = require('../models/administrador');

// GET - Obtener todos los administradores
router.get('/', async (req, res) => {
    try {
        const administradores = await Administrador.find();
        res.json(administradores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Obtener administrador por id
router.get('/id/:id', async (req, res) => {
    try {
        const administrador = await Administrador.findById(req.params.id);
        res.json(administrador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Obtener administrador por id y por dato
router.get('/id/:id/:filtro', async (req, res) => {
    try {
        const filtro = req.params.filtro;
        filtro.idAsesor = req.params.id;

        const administrador = await Administrador.find(filtro);

        res.json(administrador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Crear un nuevo administrador
router.post('/', async (req, res) => {
    try {
        const administrador = new Administrador({
            datosPersonales: {
                nombres: {
                    nombre: req.body.datosPersonales.nombres.nombre,
                    apPaterno: req.body.datosPersonales.nombres.apPaterno,
                    apMaterno: req.body.datosPersonales.nombres.apMaterno
                },
                privado: {
                    email: req.body.datosPrivados.privado.email,
                    telefono: req.body.datosPrivados.privado.telefono,
                    username: req.body.datosPrivados.privado.username,
                    password: req.body.datosPrivados.privado.password
                },
            },
            fechaRegistro: req.body.fechaRegistro
        });
        const newAdministrador = await administrador.save();
        res.status(201).json(newAdministrador);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH - Actualizar un administrador por su ID
router.patch('/:id', async (req, res) => {
    try {
        const administrador = await Administrador.findById(req.params.id);
        administrador.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || administrador.datosPersonales.nombres.nombre;
        administrador.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || administrador.datosPersonales.nombres.apPaterno;
        administrador.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || administrador.datosPersonales.nombres.apMaterno;
        administrador.datosPersonales.privado.email = req.body.datosPersonales.privado.email || administrador.datosPersonales.privado.email;
        administrador.datosPersonales.privado.telefono = req.body.datosPersonales.privado.telefono || administrador.datosPersonales.privado.telefono;
        administrador.datosPersonales.privado.username = req.body.datosPersonales.privado.username || administrador.datosPersonales.privado.username;
        administrador.datosPersonales.privado.password = req.body.datosPersonales.privado.password || administrador.datosPersonales.privado.password;
        const updatedAdministrador = await administrador.save();
        res.json(updatedAdministrador);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// DELETE - Eliminar un administrador por su ID
router.delete('/:id', async (req, res) => {
    try {
        await Administrador.findByIdAndDelete(req.params.id);
        res.json({ message: 'Administrador eliminado' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;