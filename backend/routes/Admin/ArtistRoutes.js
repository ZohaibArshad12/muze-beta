const express = require('express');
const { checkAccessToken, checkPermission } = require('../../middleware/auth.js');

let { Artists, ArtistTypes, Bookings, Reviews, Locations, ArtistGenres, ArtistsArtistGenres, ArtistsLocations } = require('../../models');

Artists = Artists.unscoped();
Reviews = Reviews.unscoped();
Locations = Locations.unscoped();
ArtistGenres = ArtistGenres.unscoped();

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));
router.use(checkPermission(['read:database-management', 'write:database-management']));

// GET /api/artists
// Route for returning all artists
router.get(
  '/',
  (req, res, next) => {
    Artists.findAll({
      include: [
        { model: Locations, as: 'Locations', required: false },
        { model: ArtistGenres, as: 'ArtistGenres', required: false },
        { model: Bookings, as: 'Bookings', required: false },
        { model: Reviews, as: 'Reviews', required: false },
        { model: ArtistTypes, as: 'ArtistType', required: false },
      ],
      order: [
        ['Bookings', 'start_time', 'desc'],
        ['Reviews', 'created', 'desc'],
      ],
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
  '/:id',
  (req, res, next) => {
    Artists.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/artists
// Route for creating a new artist
router.post(
  '/',
  (req, res, next) => {
    if (!req.body.artistGenres) req.body.artistGenres = [];
    if (!req.body.locations) req.body.locations = [];
    Artists.create(req.body)
      .then((data) => {
        Artists.findOne({
          where: {
            id: data.id,
          },
          include: [
            { model: Locations, as: 'Locations', required: false },
            { model: ArtistGenres, as: 'ArtistGenres', required: false },
          ],
        })
          .then(function(artist) {
            ArtistsArtistGenres.bulkCreate(req.body.artistGenres.map(x => ({
              artist_id: data.id,
              artist_genre_id: x.id,
            }))).then(() => {
              ArtistsLocations.bulkCreate(req.body.locations.map(x => ({
                artist_id: data.id,
                location_id: x.id,
              }))).then(() => {
                res.json(data);
              });
            });
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

// PUT /api/artists/:id
// Route for updating an existing artist
router.put(
  '/:id',
  (req, res, next) => {
    Artists.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    })
      .then((data) => {
          Artists.findOne({
            where: {
              id: req.params.id,
            },
            include: [
              { model: Locations, as: 'Locations', required: false },
              { model: ArtistGenres, as: 'ArtistGenres', required: false },
            ],
          })
            .then(function(artist) {
              ArtistsArtistGenres.destroy({
                where: {
                  artist_id: req.params.id,
                },
              }).then(() => {
                ArtistsArtistGenres.bulkCreate(req.body.artistGenres.map(x => ({
                  artist_id: req.params.id,
                  artist_genre_id: x.id,
                }))).then(() => {
                  ArtistsLocations.destroy({
                    where: {
                      artist_id: req.params.id,
                    },
                  }).then(() => {
                    ArtistsLocations.bulkCreate(req.body.locations.map(x => ({
                      artist_id: req.params.id,
                      location_id: x.id,
                    }))).then(() => {
                      res.json(data[1][0]);
                    });
                  });
                });
              });
            })
            .catch((err) => {
              next(err);
            });
        },
      );
  });

// DELETE /api/artists/:id
// Route for deleting an artist
router.delete(
  '/:id',
  (req, res, next) => {
    ArtistsLocations.destroy({
      where: {
        artist_id: req.params.id,
      },
    }).then(() => {
      ArtistsArtistGenres.destroy({
        where: {
          artist_id: req.params.id,
        },
      }).then(() => {
        Reviews.destroy({
          where: {
            artist_id: req.params.id,
          },
        }).then(() => {
          Bookings.destroy({
            where: {
              artist_id: req.params.id,
            },
          }).then(() => {
            Artists.destroy({
              where: {
                id: req.params.id,
              },
            })
              .then((data) => {
                res.sendStatus(200);
              })
              .catch((err) => {
                next(err);
              });
          });
        });
      });
    });
  },
);

module.exports = router;
