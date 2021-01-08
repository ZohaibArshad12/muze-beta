const express = require('express');
const { ArtistGenres } = require('../models');

// Create Express Router
const router = express.Router();

// GET /api/artist-genres
// Route for returning all artist genres
router.get(
  '/',
  (req, res, next) => {
    ArtistGenres.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
