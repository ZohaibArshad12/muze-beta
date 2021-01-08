const express = require('express');
const { checkAccessToken, checkPermission } = require('../../middleware/auth.js');

let { Bookings, Artists } = require('../../models');

Bookings = Bookings.unscoped();
Artists = Artists.unscoped();

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));
router.use(checkPermission(['read:database-management', 'write:database-management']));

// GET /api/bookings
// Route for returning all bookings
router.get(
  '/',
  (req, res, next) => {
    Bookings.findAll({
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


// GET /api/bookings/:id
// Route for retrieving a single booking
router.get(
  '/:id',
  (req, res, next) => {
    Bookings.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/bookings
// Route for creating a new booking
router.post(
  '/',
  (req, res, next) => {
    Bookings.create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// PUT /api/bookings/:id
// Route for updating an existing booking
router.put(
  '/:id',
  (req, res, next) => {
    Bookings.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    })
      .then((data) => {
        res.json(data[1][0]);
      })
      .catch((err) => {
        next(err);
      });
  });

// DELETE /api/bookings/:id
// Route for deleting a booking
router.delete(
  '/:id',
  (req, res, next) => {
    Bookings.destroy({
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