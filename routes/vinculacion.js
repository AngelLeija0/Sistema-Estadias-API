const express = require('express');
const router = express.Router();
const Vinculacion = require('../models/vinculador');

// GET - Obtener todos los usuarios de vinculacion
router.get('/', async (req, res) => {
    try {
        const vinculacion = await Vinculacion.find();
        res.json(Vinculacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Obtener usuario de vinculacion por id
router.get('/id/:id', async (req, res) => {
    try {
        const vinculacion = await Vinculacion.findById(req.params.id);
        res.json(vinculacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Crear un nuevo usuario de vinculacion
router.post('/', async (req, res) => {
    try {
        const vinculacion = new Vinculacion({
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
        const newVinculacion = await vinculacion.save();
        res.status(201).json(newVinculacion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH - Actualizar un usuario de vinculacion por su ID
router.patch('/:id', async (req, res) => {
    try {
        const vinculacion = await Vinculacion.findById(req.params.id);
        vinculacion.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || vinculacion.datosPersonales.nombres.nombre;
        vinculacion.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || vinculacion.datosPersonales.nombres.apPaterno;
        vinculacion.datosPersonales.nombres.nombre = req.body.datosPersonales.nombres.nombre || vinculacion.datosPersonales.nombres.apMaterno;
        vinculacion.datosPersonales.privado.email = req.body.datosPersonales.privado.email || administrador.datosPersonales.privado.email;
        vinculacion.datosPersonales.privado.telefono = req.body.datosPersonales.privado.telefono || vinculacion.datosPersonales.privado.telefono;
        vinculacion.datosPersonales.privado.username = req.body.datosPersonales.privado.username || vinculacion.datosPersonales.privado.username;
        vinculacion.datosPersonales.privado.password = req.body.datosPersonales.privado.password || vinculacion.datosPersonales.privado.password;
        const updatedVinculacion = await vinculacion.save();
        res.json(updatedVinculacion);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// DELETE - Eliminar un usuairo de vinculacion por su ID
router.delete('/:id', async (req, res) => {
    try {
        await Vinculacion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usario de vinculacion eliminado' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;