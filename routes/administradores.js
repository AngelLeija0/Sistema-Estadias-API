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
router.get('/:data', async (req, res) => {
    try {
        const administrador = await Administrador.find(req.params.data);
        res.json(administrador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Crear un nuevo administrador
router.post('/', async (req, res) => {
    try {
        const administrador = new Administrador({
            nombreAdmin: req.body.nombreAdmin,
            emailAdmin: req.body.emailAdmin,
            passwordAdmin: req.body.passwordAdmin
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
        administrador.nombreAdmin = req.body.nombreAdmin || administrador.nombreAdmin;
        administrador.emailAdmin = req.body.emailAdmin || administrador.emailAdmin;
        administrador.passwordAdmin = req.body.passwordAdmin || administrador.passwordAdmin;
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