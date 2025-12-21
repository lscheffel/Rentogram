function validatePropertyData(req, res, next) {
  const { title, address, price_per_night } = req.body;
  
  if (!title || !address || !price_per_night) {
    return res.status(400).json({ error: 'Missing required fields: title, address, price_per_night are required' });
  }
  
  if (typeof price_per_night !== 'number' || price_per_night <= 0) {
    return res.status(400).json({ error: 'price_per_night must be a positive number' });
  }
  
  next();
}

function validateReservationData(req, res, next) {
  const { property_id, guest_name, guest_email, check_in_date, check_out_date, total_price } = req.body;
  
  if (!property_id || !guest_name || !guest_email || !check_in_date || !check_out_date || !total_price) {
    return res.status(400).json({ error: 'Missing required fields: property_id, guest_name, guest_email, check_in_date, check_out_date, total_price are required' });
  }
  
  if (typeof total_price !== 'number' || total_price <= 0) {
    return res.status(400).json({ error: 'total_price must be a positive number' });
  }
  
  // Validação básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(guest_email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
}

module.exports = {
  validatePropertyData,
  validateReservationData
};