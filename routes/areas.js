const express = require('express');
const router = express.Router();
const Area = require('../models/area');

// GET - Obtener todas las Areas
router.get('/', async (req, res) => {
    try {
        const areas = await Area.find();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Obtener area por id
router.get('/id/:id', async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);
        res.json(area);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Obtener area por dato
router.get('/:data', async (req, res) => {
    try {
        const schemaProperties = Object.keys(Area.schema.obj);
        
        for (const properties of schemaProperties) {
            const filter = {};
            filter[properties] = req.params.data;
            const area = await Area.findOne(filter);
            if (area !== null) {
                return res.json(area)
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// POST - Crear una nueva Area
router.post('/', async (req, res) => {
    try {
        const area = new Area({
            idCarrera: req.body.idCarrera,
            nombreArea: req.body.nombreArea,
        });
        const newArea = await area.save();
        res.status(201).json(newArea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH - Actualizar un Area por su ID
router.patch('/:id', async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);
        area.nombreAdmin = req.body.idCarrera || area.idCarrera;
        area.emailAdmin = req.body.nombreArea || area.nombreArea;
        const updatedArea = await area.save();
        res.json(updatedArea);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// DELETE - Eliminar una Area por su ID
router.delete('/:id', async (req, res) => {
    try {
        await Area.findByIdAndDelete(req.params.id);
        res.json({ message: 'Area eliminada' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;