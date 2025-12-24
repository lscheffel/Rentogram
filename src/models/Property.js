const db = require('../database/database');
const { promisify } = require('util');

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

  static getAll(callback, page = 1, limit = null) {
    const offset = limit ? (page - 1) * limit : 0;
    let query = 'SELECT * FROM properties';
    const params = [];
    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }
    db.all(query, params, (err, rows) => {
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

  static getByIdWithReservations(id, callback) {
    const query = `
      SELECT p.id, p.title, p.description, p.address, p.price_per_night, p.bedrooms, p.bathrooms, p.max_guests, p.amenities, p.image_url, p.created_at, p.updated_at,
             r.id as reservation_id, r.guest_name, r.guest_email, r.check_in_date, r.check_out_date, r.total_price, r.status, r.created_at as reservation_created_at, r.updated_at as reservation_updated_at
      FROM properties p
      LEFT JOIN reservations r ON p.id = r.property_id
      WHERE p.id = ?
    `;
    db.all(query, [id], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      if (rows.length === 0) {
        return callback(null, null);
      }
      const property = {
        id: rows[0].id,
        title: rows[0].title,
        description: rows[0].description,
        address: rows[0].address,
        price_per_night: rows[0].price_per_night,
        bedrooms: rows[0].bedrooms,
        bathrooms: rows[0].bathrooms,
        max_guests: rows[0].max_guests,
        amenities: rows[0].amenities,
        image_url: rows[0].image_url,
        created_at: rows[0].created_at,
        updated_at: rows[0].updated_at,
        reservations: rows.filter(row => row.reservation_id !== null).map(row => ({
          id: row.reservation_id,
          guest_name: row.guest_name,
          guest_email: row.guest_email,
          check_in_date: row.check_in_date,
          check_out_date: row.check_out_date,
          total_price: row.total_price,
          status: row.status,
          created_at: row.reservation_created_at,
          updated_at: row.reservation_updated_at
        }))
      };
      callback(null, property);
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

  // Async methods
  static createAsync(propertyData) {
    return new Promise((resolve, reject) => {
      this.create(propertyData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static getAllAsync() {
    return new Promise((resolve, reject) => {
      this.getAll((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static getByIdAsync(id) {
    return new Promise((resolve, reject) => {
      this.getById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static updateAsync(id, propertyData) {
    return new Promise((resolve, reject) => {
      this.update(id, propertyData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static deleteAsync(id) {
    return new Promise((resolve, reject) => {
      this.delete(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = Property;