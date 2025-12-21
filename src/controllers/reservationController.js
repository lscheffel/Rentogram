const Reservation = require('../models/Reservation');

class ReservationController {
  static createReservation(req, res) {
    const reservationData = req.body;
    
    Reservation.create(reservationData, (err, reservation) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(reservation);
    });
  }

  static getAllReservations(req, res) {
    Reservation.getAll((err, reservations) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(reservations);
    });
  }

  static getReservationById(req, res) {
    const { id } = req.params;
    
    Reservation.getById(id, (err, reservation) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.status(200).json(reservation);
    });
  }

  static getReservationsByPropertyId(req, res) {
    const { property_id } = req.params;
    
    Reservation.getByPropertyId(property_id, (err, reservations) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(reservations);
    });
  }

  static updateReservation(req, res) {
    const { id } = req.params;
    const reservationData = req.body;
    
    Reservation.update(id, reservationData, (err, reservation) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(reservation);
    });
  }

  static deleteReservation(req, res) {
    const { id } = req.params;
    
    Reservation.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(result);
    });
  }
}

module.exports = ReservationController;