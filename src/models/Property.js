const db = require('../database/database');

class Property {
  static create(propertyData, callback) {
    const { title, description, address, price_per_night, bedrooms, bathrooms, max_guests, amenities, image_url } = propertyData;
    
    const query = `
      INSERT INTO properties 
      (title, description, address, price_per_night, bedrooms, bathrooms, max_guests, amenities, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [title, description, address, price_per_night, bedrooms, bathrooms, max_guests, amenities, image_url], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id: this.lastID, ...propertyData });
    });
  }

  static getAll(callback) {
    const query = 'SELECT * FROM properties';
    
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  static getById(id, callback) {
    const query = 'SELECT * FROM properties WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, row);
    });
  }

  static update(id, propertyData, callback) {
    const { title, description, address, price_per_night, bedrooms, bathrooms, max_guests, amenities, image_url } = propertyData;
    
    const query = `
      UPDATE properties SET
        title = ?,
        description = ?,
        address = ?,
        price_per_night = ?,
        bedrooms = ?,
        bathrooms = ?,
        max_guests = ?,
        amenities = ?,
        image_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(query, [title, description, address, price_per_night, bedrooms, bathrooms, max_guests, amenities, image_url, id], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id, ...propertyData });
    });
  }

  static delete(id, callback) {
    const query = 'DELETE FROM properties WHERE id = ?';
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { message: 'Property deleted successfully', affectedRows: this.changes });
    });
  }
}

module.exports = Property;