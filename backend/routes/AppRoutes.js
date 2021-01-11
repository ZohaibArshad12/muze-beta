const express = require('express');
const { checkAccessToken, checkPermission } = require('../middleware/auth.js');
const { Locations, ArtistTypes, ArtistGenres } = require('../models');
const Promise = require('bluebird');
const numbro = require('numbro');
const axios = require('axios')

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

// POST /api/app/zoomCreateMeeting
// Route for creating zoom meeting for user
router.post(
  '/zoomCreateMeeting',
  async (req, res, next) => {
    console.log('req.body:', req.body);

    const code = req.body.code;
    const topic = req.body.topic;
    const startTime = req.body.startTime;
    const bookDuration = req.body.bookDuration;
    const redirectURL = process.env.ZOOM_APP_REDIRECTURL
    const idSecretBase64 = (Buffer.from(`${process.env.ZOOM_APP_CLIENTID}:${process.env.ZOOM_APP_CLIENTSECRET}`)).toString('base64')
    let headers = { Authorization: `Basic ${idSecretBase64}` };

    try {
      const oAuthTokenRes = await axios.post(
        `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectURL}`,
        null,
        { headers }
      );
      if (oAuthTokenRes.data && oAuthTokenRes.data.access_token) {
        headers = { Authorization: `Bearer ${oAuthTokenRes.data.access_token}` };
        const body = {
          topic,
          "type": 2, // type 2 is schedules meeting
          "start_time": startTime,
          "duration": bookDuration,
          "password": Math.random().toString(36).slice(6), // creates a random password
          "settings": {
            "waiting_room": false,
            "join_before_host": true
          }
        }

        const createMeetingRes = await axios.post(
          `https://api.zoom.us/v2/users/me/meetings`,
          body,
          { headers }
        );

        res.json(createMeetingRes.data)
      } else {
        console.log('Error getting access token, Response Data: ', oAuthTokenRes.data);
        next(`Error getting access token, Response Data: ${oAuthTokenRes.data}`);
      }

    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;