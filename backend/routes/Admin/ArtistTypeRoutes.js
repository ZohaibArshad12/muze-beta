const express = require('express');
const { checkAccessToken, checkPermission } = require('../../middleware/auth.js');

let { ArtistTypes } = require('../../models');

ArtistTypes = ArtistTypes.unscoped();

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));
router.use(checkPermission(["read:database-management", "write:database-management"]));

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


// GET /api/artist-types/:id
// Route for retrieving a single artist types
router.get(
  '/:id',
  (req, res, next) => {
    ArtistTypes.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/artist-types
// Route for creating a new artist types
router.post(
  '/',
  (req, res, next) => {
    ArtistTypes.create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// PUT /api/artist-types/:id
// Route for updating an existing artist types
router.put(
  '/:id',
  (req, res, next) => {
    ArtistTypes.update(req.body, {
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

// DELETE /api/artist-types/:id
// Route for deleting an artist types
router.delete(
  '/:id',
  (req, res, next) => {
    ArtistTypes.destroy({
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
