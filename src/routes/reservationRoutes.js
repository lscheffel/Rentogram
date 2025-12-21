const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationController');
const { validateReservationData } = require('../middlewares/validationMiddleware');

// Rotas para reservas
router.post('/', validateReservationData, ReservationController.createReservation);
router.get('/', ReservationController.getAllReservations);
router.get('/:id', ReservationController.getReservationById);
router.get('/property/:property_id', ReservationController.getReservationsByPropertyId);
router.put('/:id', validateReservationData, ReservationController.updateReservation);
router.delete('/:id', ReservationController.deleteReservation);

module.exports = router;