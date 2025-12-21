const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/propertyController');
const { validatePropertyData } = require('../middlewares/validationMiddleware');

// Rotas para propriedades
router.post('/', validatePropertyData, PropertyController.createProperty);
router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getPropertyById);
router.put('/:id', validatePropertyData, PropertyController.updateProperty);
router.delete('/:id', PropertyController.deleteProperty);

module.exports = router;