const express = require('express');
const { ArtistTypes } = require('../models');

// Create Express Router
const router = express.Router();

// GET /api/artist-types
// Route for returning all artist-types
router.get(
  '/',
  (req, res, next) => {
    ArtistTypes.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
