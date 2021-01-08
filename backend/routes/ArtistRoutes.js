const { Op, literal } = require('sequelize');
const express = require('express');
const { Artists, Locations, ArtistGenres, ArtistTypes, Reviews, Bookings } = require('../models');

// Create Express Router
const router = express.Router();

// GET /api/artists
// Route for returning all artists
router.get(
  '/',
  (req, res, next) => {
    Artists.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// GET /api/artists/:id
// Route for retrieving a single artist
router.get(
  '/:id',
  (req, res, next) => {
    Artists.findByPk(req.params.id, {
      include: [
        { model: Locations, as: 'Locations', required: false },
        { model: ArtistGenres, as: 'ArtistGenres', required: false },
        { model: ArtistTypes, as: 'ArtistType', required: false },
        { model: Reviews, as: 'Reviews', required: false },
        {
          model: Bookings, as: 'Bookings', required: false, where: {
            start_time: {
              [Op.gte]: new Date()
            }
          },
          attributes: ['start_time', 'end_time']
        },
      ],
      order: [['Reviews', 'created', 'desc'], ['Bookings', 'start_time', 'asc']]
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// GET /api/artists/:id
// Route for retrieving a single artist
router.get(
  '/related-to/:id',
  (req, res, next) => {
    Artists.findByPk(req.params.id, {
      include: [{ all: true, required: false }],
    })
      .then((artist) => {
        const where = {};
        where['$ArtistType.id$'] = artist.artist_type_id;
        Artists.findAll({
          include: [{ all: true, required: false }],
          where: where,
          limit: 3,
          subQuery: false,
          order: literal('random()')
        })
          .then((artists) => {
            if (artists.length < 3) {
              Artists.findAll({
                include: [{ all: true, required: false }],
                where: {
                  id: {
                    [Op.ne]: artist.id,
                  },
                },
                limit: 3,
                subQuery: false,
                order: literal('random()')
              })
                .then((artists) => {
                  res.json(artists);
                })
                .catch((err) => {
                  next(err);
                });
            } else {
              res.json(artists);
            }
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  },
);

module.exports = router;
