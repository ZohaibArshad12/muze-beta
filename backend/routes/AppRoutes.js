const express = require('express');
const { checkAccessToken, checkPermission } = require('../middleware/auth.js');
const { Locations, ArtistTypes, ArtistGenres } = require('../models');
const Promise = require('bluebird');
const numbro = require('numbro');
const axios = require('axios');

// Create Express Router
const router = express.Router();

/**
 * GET /api/app/cookietest
 */
router.get('/c', (req, res, next) => {
  
  console.log(' process.env.ORIGIN::', process.env.ORIGIN);
  console.log(' req.cookies::', req.headers.cookie);
  console.log(' req.cookies::', req.cookies);
res.cookie('c4','c4val')
res.cookie('c5','c5val', {httpOnly: true, sameSite: 'none', secure: true})
res.cookie('c3','c3val', {httpOnly: true, sameSite: 'none', secure: true, domain:process.env.ORIGIN})
res.cookie('c1','c1val', {httpOnly: true})
res.cookie('c2','c2val', {httpOnly: true, secure: true})
  // console.log( 'req.session', req.session);
  if(req.session.data) {
    console.log(req.session.data);
    // res.end({asd:'asd'})
  } else {
    console.log('setting')
    req.session.data = {'asdsa':"asdsa"}
    // res.end({asd:'asd'})
  }
  
  
  // console.log('cookiesss:', req.cookies);
  // res.cookie('cok1','cok1val')
  res.send({ads:'a'})

}),

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

// POST /api/app/zoomAuthorize
// Route for authorizing zoom app for user and getting accessToken
router.post(
  '/zoomAuthorize',
  async (req, res, next) => {
    req.session.data = '13212'
    const code = req.body.code;
    const redirectURL = process.env.ZOOM_APP_REDIRECTURL
    const idSecretBase64 = (Buffer.from(`${process.env.ZOOM_APP_CLIENTID}:${process.env.ZOOM_APP_CLIENTSECRET}`)).toString('base64')
    let headers = { Authorization: `Basic ${idSecretBase64}` };
    res.cookie('zoomToken', 'asds')
    //     
    // try {
    //   const oAuthTokenRes = await axios.post(
    //     `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectURL}`,
    //     null,
    //     { headers }
    //   );
    //   if (oAuthTokenRes.data && oAuthTokenRes.data.access_token) {
    //     res.cookie('zoomToken', oAuthTokenRes.data.access_token, {httpOnly: true, secure: true})
    //     res.json({resp: 'success'})
    //   } else {
    //     console.log('Error getting access token, Response Data: ', oAuthTokenRes.data);
    //     next(`Error getting access token, Response Data: ${oAuthTokenRes.data}`);
    //   }

    // } catch (error) {
    //   next(error);
    // }
    res.send({as:'asd'})
  },
);
// POST /api/app/zoomCreateMeeting
// Route for creating zoom meeting for user
router.post(
  '/zoomCreateMeeting',
  async (req, res, next) => {
 console.log( 'req.session', req.session ); 
    console.log('req.cookies',req.cookies);
    const token = req.cookies['zoomToken'];
    console.log('token::',token);
    const topic = req.body.topic;
    const startTime = req.body.startTime;
    const bookDuration = req.body.bookDuration;
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      
        
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

        console.log('meeting resp:', createMeetingRes.data);
        res.json(createMeetingRes.data)        

    } catch (error) {
      console.log('Error creating meeting:', error);
      next(error);
    }
  },
);

// POST /api/app/deauthorize
// Route for handling zoom app deauthorize webhook and invoke Zoom Data Compliance Call
router.post('/deauthorize', async (req, res) => {
  
  try {
    if (req.headers.authorization === process.env.ZOOM_APP_VERIFICATION_TOKEN) {
      res.status(200)
      res.send()

      await axios.post(
        `https://api.zoom.us/oauth/data/compliance`,
        {
          'client_id': req.body.payload.client_id,
          'user_id': req.body.payload.user_id,
          'account_id': req.body.payload.account_id,
          'deauthorization_event_received': req.body.payload,
          'compliance_completed': true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(process.env.ZOOM_APP_CLIENTID + ':' + process.env.ZOOM_APP_CLIENTSECRET).toString('base64'),
            'cache-control': 'no-cache'
          }
        }
      );
    } else {
      res.status(401)
      res.send('Unauthorized request to Unsplash Chatbot for Zoom.')
    }

  } catch (error) {
    console.log('Error Occured while zoom deauthorize', error);
  }
});

module.exports = router;
