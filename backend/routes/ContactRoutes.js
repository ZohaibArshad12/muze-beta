const express = require('express');
const ContactFormEmail = require('../emails/ContactForm');

// Create Express Router
const router = express.Router();

// POST /api/contact
// Route for sending a message from the contact form
router.post(
  '/',
  (req, res, next) => {
    ContactFormEmail.send(req.body);
    res.json([]);
  },
);

module.exports = router;
