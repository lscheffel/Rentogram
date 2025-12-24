const Joi = require('joi');

const propertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  address: Joi.string().required(),
  price_per_night: Joi.number().positive().required(),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().integer().min(0).optional(),
  max_guests: Joi.number().integer().min(1).optional(),
  amenities: Joi.string().optional(),
  image_url: Joi.string().uri().optional()
});

const reservationSchema = Joi.object({
  property_id: Joi.number().integer().positive().required(),
  guest_name: Joi.string().required(),
  guest_email: Joi.string().email().required(),
  check_in_date: Joi.date().iso().min('now').required(),
  check_out_date: Joi.date().iso().when('check_in_date', {
    is: Joi.exist(),
    then: Joi.date().greater(Joi.ref('check_in_date'))
  }).required(),
  total_price: Joi.number().positive().required(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled').optional()
});

module.exports = {
  propertySchema,
  reservationSchema
};