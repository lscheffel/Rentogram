const { propertySchema, reservationSchema } = require('../validators/schemas');
const Property = require('../models/Property');

function validatePropertyData(req, res, next) {
  const { error } = propertySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

function validateReservationData(req, res, next) {
  const { error } = reservationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Validação de integridade referencial
  const { property_id } = req.body;
  Property.getById(property_id, (err, property) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!property) {
      return res.status(400).json({ error: 'Invalid property_id: property does not exist' });
    }
    next();
  });
}

module.exports = {
  validatePropertyData,
  validateReservationData
};