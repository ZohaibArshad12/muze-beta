const { Sequelize, Op } = require('sequelize');

const express = require('express');
const { checkAccessToken, checkPermission } = require('../middleware/auth.js');

const { Artists, Locations, ArtistTypes, ArtistGenres } = require('../models');
const Promise = require('bluebird');

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
//router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/search
 */
router.post('/', (req, res, next) => {
  const filters = req.body;
  const where = {};
  const where_ArtistGenres = {};

  if (filters.location) {
    where['$Locations.id$'] = filters.location.id;
  }
  if (filters.artistType) {
    where['$ArtistType.id$'] = filters.artistType.id;
  }
  if (filters.artistGenre) {
    where['$ArtistGenres.id$'] = filters.artistGenre.id;
  }
  if (filters.date) {
    // TODO : Add date filtering
  }

  console.log(filters);
  console.log(where);
  Artists.findAll({
    include: [
      { model: Locations, as: 'Locations', required: false },
      { model: ArtistGenres, as: 'ArtistGenres', required: false },
      { model: ArtistTypes, as: 'ArtistType', required: false },
    ],
    //include: ['Locations', 'ArtistType', 'ArtistGenres'],
    where: where,

  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
