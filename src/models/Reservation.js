const db = require('../database/database');

class Reservation {
  static create(reservationData, callback) {
    const { property_id, guest_name, guest_email, check_in_date, check_out_date, total_price, status } = reservationData;
    
    const query = `
      INSERT INTO reservations 
      (property_id, guest_name, guest_email, check_in_date, check_out_date, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [property_id, guest_name, guest_email, check_in_date, check_out_date, total_price, status || 'pending'], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id: this.lastID, ...reservationData });
    });
  }

  static getAll(callback) {
    const query = 'SELECT * FROM reservations';
    
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  static getById(id, callback) {
    const query = 'SELECT * FROM reservations WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, row);
    });
  }

  static getByPropertyId(property_id, callback) {
    const query = 'SELECT * FROM reservations WHERE property_id = ?';
    
    db.all(query, [property_id], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  static update(id, reservationData, callback) {
    const { property_id, guest_name, guest_email, check_in_date, check_out_date, total_price, status } = reservationData;
    
    const query = `
      UPDATE reservations SET
        property_id = ?,
        guest_name = ?,
        guest_email = ?,
        check_in_date = ?,
        check_out_date = ?,
        total_price = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(query, [property_id, guest_name, guest_email, check_in_date, check_out_date, total_price, status, id], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id, ...reservationData });
    });
  }

  static delete(id, callback) {
    const query = 'DELETE FROM reservations WHERE id = ?';
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { message: 'Reservation deleted successfully', affectedRows: this.changes });
    });
  }
}

module.exports = Reservation;