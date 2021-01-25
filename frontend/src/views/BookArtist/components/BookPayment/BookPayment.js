import React, { forwardRef, useState } from 'react';
import { Button, Grid, Link, TextField, Typography, useMediaQuery } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import { makeStyles } from '@material-ui/core/styles';
import { useApp } from '../../../../AppProvider';
import moment from 'moment';
import { NavLink as RouterLink } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {},
  form: {
    maxWidth: 550,
    margin: `0 auto`,
    marginTop: theme.spacing(5),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(10),
    },
  },
  label: {
    color: theme.palette.text.light,
  },
  ccLogos: {
    '& > svg': {
      marginRight: theme.spacing(1),
    },
  },
  cardElementWrap: {
    border: '1px solid #424242',
    borderRadius: '4px',
    padding: '16px 8px',
    '&:focus': {
      borderColor: '#9575cd',
      borderWidth: '2px',
    },
  },
}));

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#FFFFFF',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CustomRouterLink = forwardRef((props, ref) => (
  <span ref={ref}>
    <RouterLink {...props} />
  </span>
));

const BookPayment = props => {
  const { data, onNextStep, onPrevStep } = props;
  const classes = useStyles();
  const app = useApp();
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const [zoomMeetingError, setZoomMeetingError] = useState('');
  const [stripeError, setStripeError] = useState('');
  const [termsHasError, setTermsHasError] = useState(false);

  const handleTermsChange = (e) => {
    app.handleBookFormValuesChange({
      target: {
        name: 'termsAccepted',
        value: e.target.checked,
      },
    });
  };

  const handleChange = event => {
    app.handleBookFormValuesChange(event);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStripeError('');
    setTermsHasError(false);

    if ( zoomMeetingError && !app.bookFormValues.zoomMeetingId) {
      return;
    }
    
    if (!app.bookFormValues.termsAccepted) {
      setTermsHasError(true);
      return;
    }

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if(app.bookFormValues.useZoomAppMeetingFlow) {
      const success = await createZoomMeeting();
      if(!success) {
        app.handleBookFormValuesChange({ target: { name: 'useZoomAppMeetingFlow', value: false } });
        setZoomMeetingError('Error occured while creating Zoom meeting automatically, Kindly provide one')
        return;
      }
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setStripeError(result.error.message);
    } else {
      stripeTokenHandler(result.token, app.bookFormValues.feeTotal, `MUZE Artist Booking (${data.name} performing ${app.bookFormValues.bookDuration.name} for ${app.bookFormValues.firstname} ${app.bookFormValues.lastname})`);
    }
  };

  async function stripeTokenHandler(token, amount, description) {
    const paymentData = {
      token: token.id,
      amount: amount,
      description: description,
      confNum: app.bookFormValues.confNum,
    };

    // Use fetch to send the token ID and any other payment data to your server.
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/api/app/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    response.json().then((result) => {
      if (result.outcome.network_status === 'approved_by_network') {
        app.handleBookFormValuesChange({
          target: { name: 'ccLast4', value: result.last4 },
        });
        app.handleBookFormValuesChange({
          target: { name: 'ccBrand', value: result.brand },
        });
        app.handleBookFormValuesChange({
          target: { name: 'ccReceiptUrl', value: result.receipt_url },
        });
        app.handleBookFormValuesChange({
          target: { name: 'ccReceiptNumber', value: result.receipt_number },
        });

        setTimeout(() => {
          createBookingRecord(result);
        }, 500);
      }
    });
  }

  const createZoomMeeting = async  () => {
    const values = app.bookFormValues;
    const meetingStartDate = `${moment(values.bookDate).format('yyyy-MM-DD')}T${moment(values.bookTime).format('HH:mm:ss')}`
    const topic = values.firstname.length > 0 ? `${values.firstname}'s Event` : 'Event';

    try {
      const meetingResponse = await axios.post(`${process.env.REACT_APP_ENDPOINT}/api/app/zoomCreateMeeting`, {
        topic,
        startTime: meetingStartDate,
        bookDuration: values.bookDuration.value,
      },{withCredentials: true});
    values.zoomMeetingId = meetingResponse.data.id.toString();
    values.zoomMeetingPasscode = meetingResponse.data.password.toString();
    app.handleSetCompleteBookFormValues({ ...values });
    return true
    } catch(err) {
      console.log('Error creating zoom meeting', err);
      return false
    }
  }

  const createBookingRecord = async (chargeResult) => {
    const values = app.bookFormValues;
    const dateString = `${moment(app.bookFormValues.bookDate).format('YYYYMMDD')}T${moment(app.bookFormValues.bookTime).format('HHmm00')}`;
    const bookingData = {
      artist_id: data.id,
      artist_name: data.name,
      artist_email: data.email,
      name: `${data.name} performing ${values.bookDuration.name} for ${values.firstname} ${values.lastname}`,
      contact_firstname: values.firstname,
      contact_lastname: values.lastname,
      contact_email: values.email,
      contact_address1: values.address1,
      contact_address2: values.address2,
      contact_city: values.city,
      contact_state: values.state,
      contact_zipcode: values.zipcode,
      duration: values.bookDuration.value,
      event_style: values.eventStyle,
      event_song_requests: values.songRequests,
      event_special_requests: values.specialRequests,
      card_last4: chargeResult.last4,
      card_brand: chargeResult.brand,
      card_receipt_url: chargeResult.receipt_url,
      fee_duration: values.feeDuration,
      fee_service: values.feeService,
      fee_total: values.feeTotal,
      confirmation_code: values.confNum,
      zoom_meeting_identifier: values.zoomMeetingId.replace(/\s/g, '').trim(),
      zoom_meeting_passcode: values.zoomMeetingPasscode,
      start_time: moment(dateString).format(),
      end_time: moment(dateString).add(app.bookFormValues.bookDuration.value, 'minutes').format(),
      date: moment(app.bookFormValues.bookDate).format('dddd, MMMM Do, YYYY'),
      time: moment(app.bookFormValues.bookTime).format('LT') + ' - ' + moment(app.bookFormValues.bookTime).add(app.bookFormValues.bookDuration.value, 'minutes').format('LT'),
    };

    const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    response.json().then((result) => {
      onNextStep();
    });
  };

  return (
    <div className={classes.form}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Contact Information
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Name & Email</span><br />
            {app.bookFormValues.firstname} {app.bookFormValues.lastname}<br />
            {app.bookFormValues.email}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Address</span><br />
            {app.bookFormValues.address1}<br />
            {app.bookFormValues.address2 && (
              <>{app.bookFormValues.address2}<br /></>
            )}
            {app.bookFormValues.city}, {app.bookFormValues.state} {app.bookFormValues.zipcode}
          </Typography>
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Event Information
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Artist</span><br />
            {data.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Duration</span><br />
            {app.bookFormValues.bookDuration.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Date</span><br />
            {moment(app.bookFormValues.bookDate).format('dddd, MMMM Do, YYYY')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Time</span><br />
            {moment(app.bookFormValues.bookTime).format('LT')} - {moment(app.bookFormValues.bookTime).add(app.bookFormValues.bookDuration.value, 'minutes').format('LT')}
          </Typography>
        </Grid>
        {app.bookFormValues.eventStyle && (
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              <span className={classes.label}>Event Style</span><br />
              {app.bookFormValues.eventStyle}
            </Typography>
          </Grid>
        )}
        {app.bookFormValues.songRequests && (
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              <span className={classes.label}>Song Requests</span><br />
              {app.bookFormValues.songRequests}
            </Typography>
          </Grid>
        )}
        {app.bookFormValues.specialRequests && (
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              <span className={classes.label}>Special Requests</span><br />
              {app.bookFormValues.specialRequests}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Zoom Meeting Information
          </Typography>
        </Grid>
        {app.bookFormValues.useZoomAppMeetingFlow ?

          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
            >
              Zoom meeting information will be generated once the booking is complete.
          </Typography>
          </Grid>
          :
          <React.Fragment>
            <Grid item xs={12} md={6} data-aos="fade-up">
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                <span className={classes.label}>Zoom Meeting ID</span><br />
                {app.bookFormValues.zoomMeetingId}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-up">
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                <span className={classes.label}>Zoom Meeting Passcode</span><br />
                {app.bookFormValues.zoomMeetingPasscode}
              </Typography>
            </Grid>
          </React.Fragment>
        }
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Payment Information
          </Typography>
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
          >
            We offer secure online payments that are handled by Stripe. We accept all major debit and credit cards from
            customers around the world.
          </Typography>
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <div className={classes.ccLogos}>
            <svg width="35" height="25" viewBox="0 0 35 25"
                 xmlns="http://www.w3.org/2000/svg"><title>Visa</title>
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" d="M0 4h35v17H0z"></path>
                <path fill="#191E70" d="M4 0h27a4 4 0 0 1 4 4H0a4 4 0 0 1 4-4z"></path>
                <path fill="#F7B600" d="M0 21h35a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z"></path>
                <path fill="#191E70" fillRule="nonzero"
                      d="M16.86 8.22l-2.02 9.7h-2.46l2.02-9.7h2.46zm10.16 6.27l1.3-3.66.72 3.66h-2.02zm2.74 3.43H32l-1.95-9.7h-2.09c-.43 0-.86.3-1 .75l-3.61 8.95h2.52l.5-1.42h3.1l.3 1.42zm-6.34-3.2c0-2.54-3.4-2.7-3.4-3.81.08-.52.51-.82 1.02-.82a4.4 4.4 0 0 1 2.38.45l.43-2.1A5.97 5.97 0 0 0 21.62 8c-2.38 0-4.12 1.34-4.12 3.2 0 1.43 1.23 2.17 2.1 2.62.93.45 1.3.75 1.22 1.2 0 .66-.72.96-1.44.96-.87 0-1.73-.22-2.52-.6l-.44 2.1c.87.37 1.8.52 2.67.52 2.67.07 4.33-1.27 4.33-3.29zm-10.03-6.5l-3.89 9.7H6.9l-1.94-7.76c0-.37-.3-.67-.58-.82A8.21 8.21 0 0 0 2 8.52l.07-.3h4.11c.58 0 1.01.45 1.08.97l1.01 5.6 2.6-6.57h2.52z"></path>
              </g>
            </svg>
            <svg width="35" height="25" viewBox="0 0 35 25"
                 xmlns="http://www.w3.org/2000/svg"><title>Mastercard</title>
              <g fill="none" fillRule="evenodd">
                <rect width="35" height="25" fill="#353A48" rx="4"></rect>
                <circle cx="12.5" cy="12.5" r="7.5" fill="#ED0006"></circle>
                <circle cx="22.5" cy="12.5" r="7.5" fill="#F9A000"></circle>
                <path fill="#FF5D00" d="M17.5 6.91a7.48 7.48 0 0 1 0 11.18 7.48 7.48 0 0 1-.06-11.13z"></path>
              </g>
            </svg>
            <svg width="35" height="25" viewBox="0 0 35 25"
                 xmlns="http://www.w3.org/2000/svg"><title>American Express</title>
              <g fill="none" fillRule="evenodd">
                <rect width="35" height="25" fill="#017ECD" rx="4"></rect>
                <path fill="#FFF" fillRule="nonzero"
                      d="M17.57 12.47v-.68c0-.26-.27-.53-.53-.53h-.75v1.21h-.8V9.05h1.97c.49-.05.97.27 1.02.74v.26c0 .32-.16.63-.48.8.27.15.43.47.37.78v.84h-.8zm-1.33-2h.85c.16.06.37-.05.43-.2.05-.16-.06-.38-.22-.43h-1.06v.63zm11.38 2l-1.29-2.31v2.31h-1.6l-.27-.73h-1.5l-.26.73H21s-1.08-.15-1.08-1.63c0-1.79.91-1.84 1.28-1.84h1.02v.79h-.8c-.38.05-.64.37-.59.74v.26c0 1.16 1.39.79 1.44.79L23.3 9h1.12l1.23 3.1V9.06h1.12l1.28 2.27V9.05h.8v3.48l-1.22-.06zm-4.28-1.58h.8l-.37-1-.43 1zm-12.13 1.58v-2.36l-1.01 2.36h-.64l-1.02-2.36v2.36h-1.6l-.27-.73h-1.5l-.26.73H4L5.34 9h1.12l1.23 3.16v-3.1h1.28l.9 2.15.92-2.16h1.28v3.48l-.86-.06zM5.5 10.9h.8l-.38-1-.42 1zm7 1.58V9.05H15v.8h-1.7v.52h1.65v.79H13.3v.58H15v.73h-2.5zm6.3.06V9.05h.8v3.48h-.8zm1.76 4.42v-.69c0-.31-.26-.52-.58-.52h-.86v1.2h-.85v-3.41h2.08a.89.89 0 0 1 1.07.79v.2c0 .32-.16.64-.48.8.26.15.42.47.42.79v.84h-.8zm-1.39-2h.91c.16.05.38-.06.43-.21.05-.16-.05-.37-.21-.42a.16.16 0 0 0-.22 0h-.9v.63zm-4.32 2h-.75l-.91-1-.9 1H9.07v-3.42h3.15l.96 1.1 1.02-1.1h2.72c.53-.06 1.02.26 1.07.79v.2c0 1-.38 1.32-1.5 1.32h-.85v1.1h-.8zm-1.07-1.69l1.07 1.21v-2.36l-1.07 1.15zm-3.85.95h1.82l.85-.95-.85-.94H9.93v.52h1.76v.8H9.93v.57zm5.77-1.26h.91c.16.05.37-.06.43-.21.05-.16-.06-.37-.22-.42a.16.16 0 0 0-.21 0h-.9v.63zm10.74 2H24.9v-.8h1.34s.48.06.48-.26c0-.31-.75-.26-.75-.26-.59.1-1.07-.31-1.18-.84v-.16c-.05-.52.38-1 .91-1.05h1.82v.74h-1.34s-.48-.1-.48.26c0 .26.64.26.64.26s1.34-.1 1.34.95a1.1 1.1 0 0 1-.96 1.21h-.22l-.05-.05zm-4.6 0v-3.42h2.68v.79H22.7v.52h1.76v.8H22.7v.57h1.82v.74h-2.67zm7.6 0h-1.56v-.8h1.34s.48.06.48-.26c0-.31-.75-.26-.75-.26-.59.1-1.07-.31-1.17-.9v-.15c-.06-.53.37-1 .9-1.05h1.82v.79h-1.33s-.49-.1-.49.26c0 .26.65.26.65.26s1.33-.1 1.33.95A1.1 1.1 0 0 1 29.7 17h-.21c0-.05 0-.05-.06-.05z"></path>
              </g>
            </svg>
            <svg width="35" height="25" viewBox="0 0 35 25"
                 xmlns="http://www.w3.org/2000/svg"><title>Discover</title>
              <g fill="none" fillRule="evenodd">
                <rect width="35" height="25" fill="#FFA201" rx="4"></rect>
                <path fill="#FFF" fillRule="nonzero"
                      d="M14.55 10.1h.15c.35 0 .75.05 1.05.25v1a1.4 1.4 0 0 0-1.05-.5 1.5 1.5 0 0 0-1.4 1.55v.1c0 .8.65 1.4 1.45 1.4.4 0 .75-.2 1-.5v1c-.35.15-.7.25-1.1.25a2.28 2.28 0 0 1-2.25-2.3c0-1.3 1-2.35 2.3-2.25zm6.85 0l1.15 3 1.2-3h.9l-1.85 4.55h-.45L20.5 10.1h.9zM10.57 10h.13c.45 0 .9.2 1.25.5l-.45.6c-.2-.2-.45-.35-.7-.35-.3-.05-.55.2-.6.5 0 .25.15.35.65.55 1 .4 1.25.7 1.3 1.3v.15c-.05.8-.7 1.4-1.5 1.35-.6 0-1.2-.3-1.5-.85l.55-.55c.15.35.5.6.9.6h.05c.3 0 .6-.3.6-.65 0-.2-.1-.35-.25-.45-.2-.1-.4-.2-.6-.25-.8-.25-1.05-.6-1.05-1.2v-.05c.05-.7.65-1.25 1.35-1.2zm-5.07.1a2.18 2.18 0 0 1 2.1 2.25c0 .65-.3 1.25-.8 1.7-.45.35-1 .55-1.55.5H4V10.1zm3.3 0v4.45h-.85V10.1h.85zm18.65 0v.75H25.9v1h1.5v.75h-1.5v1.2h1.55v.75h-2.4V10.1h2.4zm1.8 0c1 0 1.55.45 1.55 1.3.05.65-.4 1.2-1 1.3l1.35 1.85H30.1l-1.15-1.8h-.1v1.8H28V10.1zm-24 .74l-.15.01h-.25v2.95h.25c.4.05.85-.1 1.15-.35.3-.3.45-.7.45-1.15 0-.4-.15-.8-.45-1.1-.3-.25-.75-.4-1.15-.35zm23.85-.04h-.25v1.35h.25c.55 0 .8-.25.8-.7 0-.4-.25-.65-.8-.65z"></path>
                <path fill="#FFF" fillRule="nonzero"
                      d="M18.35 10.05c-1.25 0-2.3 1-2.3 2.3 0 1.25 1 2.3 2.3 2.35 1.3.05 2.3-1 2.35-2.3a2.38 2.38 0 0 0-2.35-2.35z"
                      opacity=".8"></path>
              </g>
            </svg>
            <svg
              width="35" height="25" viewBox="0 0 35 25" xmlns="http://www.w3.org/2000/svg"><title>Diners Club</title>
              <g fill="none" fillRule="evenodd">
                <rect width="35" height="25" fill="#2283CB" rx="4"></rect>
                <path fill="#FFF" fillRule="nonzero"
                      d="M18.98 5a7.57 7.57 0 0 1 7.63 7.5v.07A7.64 7.64 0 0 1 18.98 20h-2.67A7.45 7.45 0 0 1 9 12.57 7.29 7.29 0 0 1 15.97 5h3zM16.5 6.3c-3.39 0-6.2 2.8-6.2 6.2 0 3.4 2.81 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2z"></path>
                <path fill="#FFF" fillRule="nonzero"
                      d="M17.48 16.67V8.4a4.26 4.26 0 0 1 0 8.28zm-1.96 0a4.29 4.29 0 0 1 0-8.28v8.28z"></path>
              </g>
            </svg>
            <svg
              width="35" height="25" viewBox="0 0 35 25" xmlns="http://www.w3.org/2000/svg"><title>JCB</title>
              <g fill="none" fillRule="evenodd">
                <rect width="35" height="25" fill="#FFF" rx="4"></rect>
                <path fill="#46A548" fillRule="nonzero"
                      d="M26.2 3C24.4 3 23 4.4 23 6.2V9h4.9c.9-.1 1.7.7 1.8 1.6v.1c0 .9-.6 1.6-1.5 1.7 1 0 1.8.8 1.9 1.8 0 1-.9 1.8-1.9 1.8H23v6h4.7c1.8 0 3.2-1.4 3.2-3.2V3h-4.7zM25 14.9h2.3c.5-.2.8-.7.7-1.3-.1-.3-.4-.6-.7-.7H25v2zm2.8-4c0-.4-.3-.8-.7-.9H25v1.8h2.1c.4-.1.7-.5.7-.9z"></path>
                <path fill="#D02644" fillRule="nonzero"
                      d="M17.2 3C15.4 3 14 4.4 14 6.2V10c.8-.8 2.2-1.3 4.5-1.2.9.1 1.7.2 2.5.4v1.5c-.7-.4-1.6-.7-2.4-.8-1.4-.1-2.6.9-2.8 2.2-.1 1.4.9 2.6 2.2 2.8h.5c.9-.1 1.7-.4 2.4-.8v1.5c-.8.2-1.7.4-2.5.4-2.3.1-3.7-.4-4.5-1.2v7h4.8c1.8 0 3.2-1.4 3.2-3.2V3h-4.7z"></path>
                <path fill="#1B6BAF" fillRule="nonzero"
                      d="M5 6.2v8c.8.5 1.7.8 2.7.8.9 0 1.6-.7 1.7-1.6V9h2.7v4.2c0 1.6-.9 3-3.8 3-1.1 0-2.2-.2-3.2-.4V22h4.8c1.8 0 3.2-1.4 3.2-3.2V3H8.2C6.4 3 5 4.4 5 6.2z"></path>
              </g>
            </svg>
          </div>
        </Grid>
        {stripeError && (
          <Grid item xs={12} data-aos="fade-up">
            {stripeError}
          </Grid>
        )}
        <Grid item xs={12} data-aos="fade-up">
          <div className={classes.cardElementWrap}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </Grid>

        {zoomMeetingError &&
          <React.Fragment>
            <Grid item xs={12} data-aos="fade-up">
              {zoomMeetingError}
            </Grid>

            <Grid item xs={6} data-aos="fade-up">
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Zoom Meeting ID*
              </Typography>
              <TextField
                placeholder="Zoom Meeting ID"
                variant="outlined"
                size="medium"
                name="zoomMeetingId"
                fullWidth
                type="text"
                value={app.bookFormValues.zoomMeetingId}
                onChange={handleChange}
                helperText={!app.bookFormValues.zoomMeetingId ? 'Zoom meeting Id required' : null}
                error={!app.bookFormValues.zoomMeetingId}
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={6} data-aos="fade-up">
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Zoom Meeting Passcode
              </Typography>
              <TextField
                placeholder="Passcode, if any"
                variant="outlined"
                size="medium"
                name="zoomMeetingPasscode"
                fullWidth
                type="text"
                value={app.bookFormValues.zoomMeetingPasscode}
                onChange={handleChange}
                className={classes.textField}
              />
            </Grid>
          </React.Fragment>
        }

        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Terms & Conditions
          </Typography>
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={app.bookFormValues.termsAccepted} onChange={handleTermsChange}
                                 name="termsAccepted" />}
              label={(
                <>
                  Check here if you have read and agree to the <Link color="textSecondary"
                        component={CustomRouterLink}
                        to={'/terms'}
                  >
                    terms & conditions.
                  </Link>
                </>
              )}
            />
            {termsHasError &&
            <FormHelperText error={termsHasError}>You must accept the terms & conditions to book an artist.</FormHelperText>
            }
          </FormGroup>
        </Grid>
        <Grid item container justify="flex-start" xs={6}>
          <Button
            variant="outlined"
            type="submit"
            size="large"
            onClick={onPrevStep}
          >
            Back
          </Button>
        </Grid>
        <Grid item container justify="flex-end" xs={6}>
          <Button
            variant="contained"
            type="submit"
            color="secondary"
            size="large"
            disabled={!app.bookFormValues.useZoomAppMeetingFlow && !app.bookFormValues.zoomMeetingId}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BookPayment;