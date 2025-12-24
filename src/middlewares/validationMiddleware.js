const { propertySchema, reservationSchema } = require('../validators/schemas');
const Property = require('../models/Property');
const { ValidationError, NotFoundError } = require('../errors');

async function validatePropertyData(req, res, next) {
  const { error } = propertySchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }
  next();
}

async function validateReservationData(req, res, next) {
  const { error } = reservationSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  // Validação de integridade referencial
  const { property_id } = req.body;
  const property = await Property.getByIdAsync(property_id);
  if (!property) {
    throw new ValidationError('Propriedade inválida: propriedade não existe');
  }
  next();
}

module.exports = {
  validatePropertyData,
  validateReservationData
};