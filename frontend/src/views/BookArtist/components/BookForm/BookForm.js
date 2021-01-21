import React, { forwardRef, useEffect, useState } from 'react';
import { Button, Grid, Typography, useMediaQuery,Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { useApp } from '../../../../AppProvider';
import { TextField as MuiTextField } from '@material-ui/core';
import debouncedInput from 'components/molecules/DebouncedInput';
import validate from 'validate.js';

const redirectURL = `${window.location.origin}/redirect`;
const ZOOM_OAUTH_AUTHENTICATE_URL = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_ZOOM_APP_CLIENTID}&redirect_uri=${redirectURL}`

const randtoken = require('rand-token').generator({
  chars: 'A-Z',
});
const TextField = debouncedInput(MuiTextField);

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
}));

const schema = {
  firstname: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128,
    },
  },
  lastname: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128,
    },
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 300,
    },
  },
  address1: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  city: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  state: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  zipcode: {
    presence: { allowEmpty: false, message: 'is required' },
    format: { pattern: /\d{5}(-\d{4})?/, message: 'must be 5 or 9 digits' },
  },
  zoomMeetingId: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  eventStyle: {
    presence: { allowEmpty: false, message: 'is required' },
  },
};

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <RouterLink {...props} />
  </div>
));

const BookForm = props => {
  const { data, onNextStep } = props;
  const classes = useStyles();
  const app = useApp();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });
  const location = useLocation();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [zoomAuthTriggered, setZoomAuthTriggered] = useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      ...app.bookFormValues,
    },
    touched: {},
    errors: {},
  });
  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: !errors,
      errors: errors || {},
    }));

    console.log(errors);

  }, [formState.values]);

  const handleChange = event => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));

    app.handleBookFormValuesChange(event);
  };

  const handleNextStep = () => {
    setFormSubmitted(true);
    if(app.bookFormValues.useZoomAppMeetingFlow) {
      schema.zoomMeetingId.presence.allowEmpty = true
    }
     const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: !errors,
      errors: errors || {},
    }));

    if (!errors) {
      onNextStep();
      const confNum = randtoken.generate(8);
      app.handleBookFormValuesChange({ target: { name: 'confNum', value: confNum } });
    }
  };

  const handleUseZoomAppMeetingFlow = (event) => {
    app.handleBookFormValuesChange({ target: { name: 'useZoomAppMeetingFlow', value: event.target.checked } });

    if(event.target.checked) {
      setZoomAuthTriggered(true);
      localStorage.setItem('book-artist-form-state', JSON.stringify({...app.bookFormValues, useZoomAppMeetingFlow: true}));
      localStorage.setItem('url-before-redirect', location.pathname.slice(1, location.pathname.length));
      window.location.assign(ZOOM_OAUTH_AUTHENTICATE_URL);
    } else {
      schema.zoomMeetingId.presence.allowEmpty = false
    }
  }

  const hasError = field =>
    (formSubmitted || formState.touched[field]) && formState.errors[field]
      ? true : false;

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
        <Grid item xs={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            First Name*
          </Typography>
          <TextField
            placeholder="Your first name"
            variant="outlined"
            size="medium"
            name="firstname"
            fullWidth
            type="text"
            value={app.bookFormValues.firstname}
            onChange={handleChange}
            helperText={hasError('firstname') ? formState.errors.firstname[0] : null}
            error={hasError('firstname')}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Last Name*
          </Typography>
          <TextField
            placeholder="Your last name"
            variant="outlined"
            size="medium"
            name="lastname"
            fullWidth
            type="text"
            value={app.bookFormValues.lastname}
            onChange={handleChange}
            helperText={hasError('lastname') ? formState.errors.lastname[0] : null}
            error={hasError('lastname')}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            E-mail*
          </Typography>
          <TextField
            placeholder="Your e-mail address"
            variant="outlined"
            size="medium"
            name="email"
            fullWidth
            type="email"
            value={app.bookFormValues.email}
            onChange={handleChange}
            helperText={hasError('email') ? formState.errors.email[0] : null}
            error={hasError('email')}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Address*
          </Typography>
          <TextField
            placeholder="Street Address Line 1"
            variant="outlined"
            size="medium"
            name="address1"
            fullWidth
            type="text"
            value={app.bookFormValues.address1}
            onChange={handleChange}
            helperText={hasError('address1') ? formState.errors.address1[0] : null}
            error={hasError('address1')}
            className={classes.textField}
          />
          <TextField
            placeholder="Street Address Line 2"
            variant="outlined"
            size="medium"
            name="address2"
            fullWidth
            type="text"
            value={app.bookFormValues.address2}
            onChange={handleChange}
            className={classes.textField}
            style={{ marginTop: theme.spacing(4) }}
          />
        </Grid>
        <Grid item xs={6} data-aos="fade-up">
          <TextField
            placeholder="City"
            variant="outlined"
            size="medium"
            name="city"
            fullWidth
            type="text"
            value={app.bookFormValues.city}
            onChange={handleChange}
            helperText={hasError('city') ? formState.errors.city[0] : null}
            error={hasError('city')}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={3} data-aos="fade-up">
          <TextField
            placeholder="State"
            variant="outlined"
            size="medium"
            name="state"
            fullWidth
            type="text"
            value={app.bookFormValues.state}
            onChange={handleChange}
            helperText={hasError('state') ? formState.errors.state[0] : null}
            error={hasError('state')}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={3} data-aos="fade-up">
          <TextField
            placeholder="Zip Code"
            variant="outlined"
            size="medium"
            name="zipcode"
            fullWidth
            type="text"
            value={app.bookFormValues.zipcode}
            onChange={handleChange}
            helperText={hasError('zipcode') ? formState.errors.zipcode[0] : null}
            error={hasError('zipcode')}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} data-aos="fade-up" style={{ marginTop: theme.spacing(8) }}>
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Event Information
          </Typography>
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Describe Your Event's Style*
          </Typography>
          <TextField
            placeholder='Special occassion, "Jazz Brunch Sunday", "Throwback Thursday", etc.'
            variant="outlined"
            name="eventStyle"
            fullWidth
            multiline
            rows={4}
            value={app.bookFormValues.eventStyle}
            onChange={handleChange}
            helperText={hasError('eventStyle') ? formState.errors.eventStyle[0] : null}
            error={hasError('eventStyle')}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Song Requests
          </Typography>
          <TextField
            placeholder='Please specify song title and artist, or include URL to playlist'
            variant="outlined"
            name="songRequests"
            fullWidth
            multiline
            rows={4}
            value={app.bookFormValues.songRequests}
            onChange={handleChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Special Requests
          </Typography>
          <TextField
            placeholder='Surprised Birthday, All Black Dresscode, etc.'
            variant="outlined"
            name="specialRequests"
            fullWidth
            multiline
            rows={4}
            value={app.bookFormValues.specialRequests}
            onChange={handleChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} data-aos="fade-up" style={{ marginTop: theme.spacing(8) }}>
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Zoom Meeting Information
          </Typography>
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            style={{ color: theme.palette.text.light }}
          >
            Schedule with Zoom a meeting for your event.
          </Typography>
        </Grid>

        <Grid item xs={12} data-aos="fade-up">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={app.bookFormValues.useZoomAppMeetingFlow} onChange={handleUseZoomAppMeetingFlow}
                name="useZoomAppMeetingFlow" />}
              label={(
                <>
                  Authorize And Automatically Schedule with Zoom
                </>
              )}
            />
          </FormGroup>
        </Grid>

        {!app.bookFormValues.useZoomAppMeetingFlow &&

          <React.Fragment>
            <Grid item xs={12} data-aos="fade-up">
              <Typography
                variant="subtitle1"
                style={{ color: theme.palette.text.light }}
              >
                OR provide the following details for the artist to join your event.
          </Typography>
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
                helperText={hasError('zoomMeetingId') ? formState.errors.zoomMeetingId[0] : null}
                error={hasError('zoomMeetingId')}
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
        {formSubmitted && !formState.isValid && (
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="error"
              className={classes.inputTitle}
            >
              Please correct the errors above.
            </Typography>
          </Grid>
        )}
        <Grid item container justify="flex-start" xs={6}>
          <Button
            variant="outlined"
            type="submit"
            size="large"
            component={CustomRouterLink}
            to={`/artists/${data.id}`}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item container justify="flex-end" xs={6}>
          <Button
            variant="contained"
            type="submit"
            color="secondary"
            size="large"
            disabled={zoomAuthTriggered}
            onClick={handleNextStep}
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BookForm;
