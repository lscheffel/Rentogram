const Reservation = require('../models/Reservation');
const { DatabaseError, NotFoundError } = require('../errors');

class ReservationController {
  static async createReservation(req, res, next) {
    try {
      const reservationData = req.body;
      const reservation = await Reservation.createAsync(reservationData);
      res.status(201).json(reservation);
    } catch (error) {
      next(new DatabaseError('Erro ao criar reserva'));
    }
  }

  static async getAllReservations(req, res, next) {
    try {
      const reservations = await Reservation.getAllAsync();
      res.status(200).json(reservations);
    } catch (error) {
      next(new DatabaseError('Erro ao buscar reservas'));
    }
  }

  static async getReservationById(req, res, next) {
    try {
      const { id } = req.params;
      const reservation = await Reservation.getByIdAsync(id);
      if (!reservation) {
        throw new NotFoundError('Reserva não encontrada');
      }
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  }

  static async getReservationsByPropertyId(req, res, next) {
    try {
      const { property_id } = req.params;
      const reservations = await Reservation.getByPropertyIdAsync(property_id);
      res.status(200).json(reservations);
    } catch (error) {
      next(new DatabaseError('Erro ao buscar reservas da propriedade'));
    }
  }

  static async updateReservation(req, res, next) {
    try {
      const { id } = req.params;
      const reservationData = req.body;
      const reservation = await Reservation.updateAsync(id, reservationData);
      res.status(200).json(reservation);
    } catch (error) {
      next(new DatabaseError('Erro ao atualizar reserva'));
    }
  }

  static async deleteReservation(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Reservation.deleteAsync(id);
      res.status(200).json(result);
    } catch (error) {
      next(new DatabaseError('Erro ao deletar reserva'));
    }
  }
}

module.exports = ReservationController;