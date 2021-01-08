const express = require('express');
const { Bookings } = require('../models');
const NewBookingEmail = require('../emails/NewBooking');

// Create Express Router
const router = express.Router();

// POST /api/bookings
// Route for creating a new booking
router.post(
  '/',
  (req, res, next) => {
    Bookings.create(req.body)
      .then((data) => {
        NewBookingEmail.send(req.body);
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
