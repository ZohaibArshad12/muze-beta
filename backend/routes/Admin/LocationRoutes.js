const express = require('express');
const { checkAccessToken, checkPermission } = require('../../middleware/auth.js');

let { Locations } = require('../../models');

Locations = Locations.unscoped();

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));
router.use(checkPermission(["read:database-management", "write:database-management"]));

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


// GET /api/locations/:id
// Route for retrieving a single artist
router.get(
  '/:id',
  (req, res, next) => {
    Locations.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/locations
// Route for creating a new artist
router.post(
  '/',
  (req, res, next) => {
    Locations.create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// PUT /api/locations/:id
// Route for updating an existing artist
router.put(
  '/:id',
  (req, res, next) => {
    Locations.update(req.body, {
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
  },
);

// DELETE /api/locations/:id
// Route for deleting an artist
router.delete(
  '/:id',
  (req, res, next) => {
    Locations.destroy({
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
