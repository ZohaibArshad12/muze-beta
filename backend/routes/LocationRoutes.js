const express = require('express');
const { Locations } = require('../models');

// Create Express Router
const router = express.Router();

// GET /api/locations
// Route for returning all locations
router.get(
  '/',
  (req, res, next) => {
    Locations.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
