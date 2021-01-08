const express = require('express');
const { checkAccessToken, checkPermission } = require('../middleware/auth.js');
const { Locations, ArtistTypes, ArtistGenres } = require('../models');
const Promise = require('bluebird');
const numbro = require('numbro');

// Create Express Router
const router = express.Router();


/**
 * GET /api/app/hydrate
 */
router.get('/hydrate', (req, res, next) => {
  let calls = [];

  calls.push(Locations.findAll());
  calls.push(ArtistTypes.findAll());
  calls.push(ArtistGenres.findAll());

  Promise.all(calls).then(([
                             locations,
                             artistTypes,
                             artistGenres,
                           ]) => {
    res.json({
      locations: locations,
      artistTypes: artistTypes,
      artistGenres: artistGenres,
    });
  });
});

// POST /api/app/charge
// Route for creating a new Stripe charge
router.post(
  '/charge',
  async (req, res, next) => {
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Token is created using Stripe Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.token; // Using Express

    const amount = req.body.amount * 100;

    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      description: req.body.description,
      source: token,
      metadata: {
        confirmation_code: req.body.confNum
      }
    });

    console.log(charge);

    const result = {
      outcome: charge.outcome,
      last4: charge.source.last4,
      brand: charge.source.brand,
      receipt_url: charge.receipt_url,
      receipt_number: charge.receipt_number,
    }

    res.json(result);
  },
);

module.exports = router;
