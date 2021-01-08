const express = require('express');
const { checkAccessToken, checkPermission } = require('../../middleware/auth.js');

let { Reviews, Artists } = require('../../models');

Reviews = Reviews.unscoped();
Artists = Artists.unscoped();

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));
router.use(checkPermission(['read:database-management', 'write:database-management']));

// GET /api/reviews
// Route for returning all reviews
router.get(
  '/',
  (req, res, next) => {
    Reviews.findAll({
      include: [
        { model: Artists, as: 'Artist', required: false },
      ],
      order: [
        ['created', 'desc'],
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


// GET /api/reviews/:id
// Route for retrieving a single reviews
router.get(
  '/:id',
  (req, res, next) => {
    Reviews.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/reviews
// Route for creating a new reviews
router.post(
  '/',
  (req, res, next) => {
    Reviews.create(req.body)
      .then((data) => {
        Reviews.findOne({ where: { id: data.id } })
          .then(function(review) {
            Reviews.findAll({
              where: { artist_id: review.artist_id, active: true },
              attributes: ['rating'],
            }).then((reviews) => {
              const totalRatings = reviews.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.rating), 0);
              const maxRatings = reviews.length * 5;
              let averageRating = totalRatings / maxRatings * 5;
              averageRating = parseFloat((Math.round((averageRating + Number.EPSILON) * 100) / 100).toFixed(1));
              if (isNaN(averageRating)) averageRating = 0;
              console.log(averageRating);
              Artists.update({ rating: averageRating }, {
                where: { id: review.artist_id },
              }).then(() => {
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

// PUT /api/reviews/:id
// Route for updating an existing reviews
router.put(
  '/:id',
  (req, res, next) => {
    Reviews.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    })
      .then((data) => {
          Reviews.findOne({ where: { id: req.params.id } })
            .then(function(review) {
              Reviews.findAll({
                where: { artist_id: review.artist_id, active: true },
                attributes: ['rating'],
              }).then((reviews) => {
                const totalRatings = reviews.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.rating), 0);
                const maxRatings = reviews.length * 5;
                let averageRating = totalRatings / maxRatings * 5;
                averageRating = parseFloat((Math.round((averageRating + Number.EPSILON) * 100) / 100).toFixed(1));
                Artists.update({ rating: averageRating }, {
                  where: { id: review.artist_id },
                }).then(() => {
                  res.json(data[1][0]);
                });
              });
            })
            .catch((err) => {
              next(err);
            });
        },
      );
  });

// DELETE /api/reviews/:id
// Route for deleting an reviews
router.delete(
  '/:id',
  (req, res, next) => {
    Reviews.destroy({
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
  },
);

module.exports = router;
