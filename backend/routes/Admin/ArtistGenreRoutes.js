const express = require('express');
const { checkAccessToken, checkPermission } = require('../../middleware/auth.js');

let { ArtistGenres } = require('../../models');

ArtistGenres = ArtistGenres.unscoped();

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));
router.use(checkPermission(["read:database-management", "write:database-management"]));

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


// GET /api/artist-genres/:id
// Route for retrieving a single artist genres
router.get(
  '/:id',
  (req, res, next) => {
    ArtistGenres.findByPk(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// POST /api/artist-genres
// Route for creating a new artist genres
router.post(
  '/',
  (req, res, next) => {
    ArtistGenres.create(req.body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
);

// PUT /api/artist-genres/:id
// Route for updating an existing artist genres
router.put(
  '/:id',
  (req, res, next) => {
    ArtistGenres.update(req.body, {
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

// DELETE /api/artist-genres/:id
// Route for deleting an artist genres
router.delete(
  '/:id',
  (req, res, next) => {
    ArtistGenres.destroy({
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
