const express = require('express');
const { checkAccessToken, checkPermission } = require('../../middleware/auth.js');

let { Concerts } = require('../../models');

Concerts = Concerts.unscoped();

// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));
router.use(checkPermission(['read:database-management', 'write:database-management']));

// GET /api/concerts
// Route for returning all concerts
router.get('/', (req, res, next) => {
  Concerts.findAll({
    order: [['created', 'desc']],
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

// GET /api/concerts/:id
// Route for retrieving a single concert
router.get('/:id', (req, res, next) => {
  Concerts.findByPk(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

// POST /api/concerts
// Route for creating a new concert
router.post('/', (req, res, next) => {
  Concerts.create(req.body)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

// PUT /api/concerts/:id
// Route for updating an existing concert
router.put('/:id', (req, res, next) => {
  Concerts.update(req.body, {
    where: {
      id: req.params.id,
    },
    returning: true,
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

// DELETE /api/concerts/:id
// Route for deleting an concert
router.delete('/:id', (req, res, next) => {
  Concerts.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
