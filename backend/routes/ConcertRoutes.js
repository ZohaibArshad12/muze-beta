const express = require('express');
const { Concerts } = require('../models');

// Create Express Router
const router = express.Router();

// GET /api/concerts
// Route for returning all concerts
router.get('/', (req, res, next) => {
  Concerts.findAll()
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

module.exports = router;
