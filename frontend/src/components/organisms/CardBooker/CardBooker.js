import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, colors, Grid, TextField, useMediaQuery } from '@material-ui/core';
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useApp } from '../../../AppProvider';
import Divider from '@material-ui/core/Divider';
import useTheme from '@material-ui/core/styles/useTheme';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AvailableDateIcon from '@material-ui/icons/EventAvailable';
import UnavailableDateIcon from '@material-ui/icons/EventBusy';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { goTo } from '../../../utils';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  withShadow: {
    boxShadow: '0 2px 10px 0 rgba(23,70,161,.11)',
  },
  noShadow: {
    boxShadow: 'none',
  },
  noBorder: {
    border: 0,
  },
  noBg: {
    background: 'transparent',
  },
  liftUp: {
    transition:
      'box-shadow .25s ease,transform .25s ease,-webkit-transform .25s ease',
    '&:hover': {
      boxShadow:
        '0 1.5rem 2.5rem rgba(22,28,45,.1),0 .3rem 0.5rem -.50rem rgba(22,28,45,.05) !important',
      transform: 'translate3d(0,-5px,0)',
    },
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 2, 4, 2),
    '&:last-child': {
      padding: theme.spacing(2, 2, 4, 2),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3, 3, 6, 3),
      '&:last-child': {
        padding: theme.spacing(3, 3, 6, 3),
      },
    },
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  center: {
    alignItems: 'center',
  },
  textField: {
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
  },
  inputIcon: {
    color: colors.grey[600],
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  formWithoutPrice: {
    marginTop: theme.spacing(3),
  },
  rate: {
    fontWeight: 'bold',
    display: 'flex',
    '& span': {
      display: 'block',
    },
  },
  rateCaption: {
    fontSize: '.8rem',
    alignSelf: 'center',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.light,
  },
  subtotal: {
    color: theme.palette.text.light,
  },
  priceTable: {
    backgroundColor: theme.palette.background.topnav,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  alreadyBookedIcon: {
    backgroundColor: theme.palette.error.main,
  },
  alreadyBookedText: {
    color: theme.palette.error.main,
  }
}));

/**
 * Component to display the product card
 *
 * @param {Object} props
 */
const CardBooker = props => {
  const {
    data,
    withShadow,
    withPrice = false,
    noButton = false,
    noShadow,
    noBorder,
    noBg,
    liftUp,
    align,
    className,
    ...rest
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const app = useApp();

  const durations = app.durations;
  const serviceFeePercentage = app.settings.serviceFeePercentage;

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [date, setDate] = useState(app.bookFormValues.bookDate);
  const [time, setTime] = useState(app.bookFormValues.bookTime);
  const [duration, setDuration] = useState(app.bookFormValues.bookDuration);
  const [feeTotal, setFeeTotal] = useState({
    duration: app.bookFormValues.feeDuration,
    service: app.bookFormValues.feeService,
    total: app.bookFormValues.feeTotal,
  });

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  useEffect(() => {
    if (app.filterValues.date) {
      setDate(app.filterValues.date);
      setTime(app.filterValues.date);
    } else if (app.bookFormValues.bookDate) {
      setDate(app.bookFormValues.bookDate);
      setTime(app.bookFormValues.bookTime);
    } else {
      const m = moment(new Date());
      const roundUpToNearestHour = m.minute() || m.second() || m.millisecond() ? m.add(1, 'hour').startOf('hour') : m.startOf('hour');
      const defaultBookTime = roundUpToNearestHour.add(3, 'hours');
      setDate(defaultBookTime);
      setTime(defaultBookTime);
      app.handleBookFormValuesChange({ target: { name: 'bookDate', value: defaultBookTime } });
      app.handleBookFormValuesChange({ target: { name: 'bookTime', value: defaultBookTime } });
    }
  }, [app.bookFormValues.bookDate, app.filterValues.date]); //eslint-disable-line

  useEffect(() => {
    const durationFee = data.rate * (duration.value / 10);
    const serviceFee = Math.round(durationFee * serviceFeePercentage);
    const totalFee = durationFee + serviceFee;
    setFeeTotal((prevState) => ({
      ...prevState,
      duration: durationFee,
      service: serviceFee,
      total: totalFee,
    }));
    app.handleBookFormValuesChange({ target: { name: 'feeDuration', value: durationFee } });
    app.handleBookFormValuesChange({ target: { name: 'feeService', value: serviceFee } });
    app.handleBookFormValuesChange({ target: { name: 'feeTotal', value: totalFee } });
  }, [duration]); //eslint-disable-line

  const handleDateChange = (value) => {
    app.handleBookFormValuesChange({ target: { name: 'bookDate', value: value } });
    app.handleFilterValuesChange({ target: { name: 'date', value: value } });
    setDate(value);
  };

  const handleTimeChange = (value) => {
    app.handleBookFormValuesChange({ target: { name: 'bookTime', value: value } });
    app.handleFilterValuesChange({ target: { name: 'date', value: value } });
    setTime(value);
  };

  const handleDurationChange = (event, value) => {
    app.handleBookFormValuesChange({ target: { name: 'bookDuration', value: value } });
    setDuration(value);
  };

  const handleBookBtnClick = (event) => {
    setErrorMessage('');
    setHasError(false);

    const dateString = `${moment(app.bookFormValues.bookDate).format('YYYYMMDD')}T${moment(app.bookFormValues.bookTime).format('HHmm00')}`;
    const startDate = moment(dateString);
    const endDate = moment(dateString).add(app.bookFormValues.bookDuration.value, 'minutes');

    let alreadyBooked = false;
    data.Bookings.forEach((booking) => {
      const bookingStart = moment(booking.start_time).add(moment().utcOffset(), 'minutes');
      const bookingEnd = moment(booking.end_time).add(moment().utcOffset(), 'minutes');
      if (moment(startDate).isBetween(bookingStart, bookingEnd, undefined, '[]')) {
        booking.alreadyBooked = true;
        alreadyBooked = true;
      }
      if (moment(endDate).isBetween(bookingStart, bookingEnd, undefined, '[]')) {
        booking.alreadyBooked = true;
        alreadyBooked = true;
      }
    });

    if (moment(startDate).isBefore(new Date())) {
      setHasError(true);
      setErrorMessage('Selected date & time is in the past.')
    } else if (moment(startDate).isBefore(moment(new Date()).add('3', 'hours'))) {
      setHasError(true);
      setErrorMessage('Bookings must be made at least 3 hours in advance to give artists time to prepare.')
    } else if (alreadyBooked) {
      setHasError(true);
      setErrorMessage('Artist is already booked for the selected slot.')
    } else {
      setErrorMessage('');
      setHasError(false);
      goTo(history, `artists/book/${data.id}`);
    }
  };

  return (
    <Card
      className={clsx(
        'card-product',
        classes.root,
        withShadow ? classes.withShadow : {},
        noShadow ? classes.noShadow : {},
        noBorder ? classes.noBorder : {},
        noBg ? classes.noBg : {},
        liftUp ? classes.liftUp : {},
        className,
      )}
      {...rest}
    >
      <CardContent
        className={clsx(
          'card-product__content',
          classes.content,
          classes[align],
        )}
      >
        <Grid container spacing={4}>
          {withPrice && (
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                variant="h4"
                className={classes.rate}
                style={{ justifyContent: 'center' }}
              >
                <span>${data.rate}</span> <span className={classes.rateCaption}>per 10 minutes</span>
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container spacing={3} className={withPrice ? '' : classes.formWithoutPrice}>
                <Grid item xs={6}>
                  <DatePicker
                    autoOk
                    disablePast
                    disableToolbar
                    variant="inline"
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date"
                    label="Date"
                    className={clsx(classes.datePicker, classes.textField)}
                    value={date}
                    onChange={handleDateChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i
                            className={clsx(
                              'fas fa-calendar',
                              classes.inputIcon,
                            )}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    autoOk
                    disablePast
                    variant="inline"
                    inputVariant="outlined"
                    margin="normal"
                    id="time"
                    label="Time"
                    className={clsx(classes.datePicker, classes.textField)}
                    value={time}
                    onChange={handleTimeChange}
                    error={hasError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i
                            className={clsx(
                              'fas fa-clock',
                              classes.inputIcon,
                            )}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="duration"
              options={durations}
              value={duration}
              getOptionLabel={option => option.name}
              disableClearable={true}
              onChange={handleDurationChange}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Duration"
                  size={isMd ? 'medium' : 'small'}
                  placeholder=""
                  className={classes.textField}
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true,
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <i
                          className={clsx(
                            'fas fa-stopwatch',
                            classes.inputIcon,
                          )}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          {withPrice && (
            <Grid item xs={12} style={{ padding: theme.spacing(3) }}>
              <Grid container spacing={2} className={classes.priceTable}>
                <Grid item xs={8}>
                  <Typography variant="body1" className={classes.subtotal}>
                    ${data.rate} x {duration.value} minutes
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" align="right" className={classes.subtotal}>
                    ${feeTotal.duration}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" className={classes.subtotal}>
                    Service Fee ({serviceFeePercentage * 100}%)
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" align="right" className={classes.subtotal}>
                    ${feeTotal.service}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6">
                    <strong>TOTAL</strong>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="right">
                    <strong>${feeTotal.total}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {noButton === false && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={handleBookBtnClick}
              >
                Book
              </Button>
            </Grid>
          )}
          {errorMessage.length > 0 && (
            <Grid item xs={12}>
              <Typography
                variant="body1"
                color="error"
                align="center"
              >
                {errorMessage}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider />
            <List className={classes.root}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: theme.lightPurple }}>
                    <AvailableDateIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Availability" secondary={data.availability || 'Monday - Friday, 9am - 9pm'} />
              </ListItem>
              {data.Bookings.map((booking, index) =>
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar className={booking.alreadyBooked ? classes.alreadyBookedIcon : ''}>
                      <UnavailableDateIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Already Booked" secondary={
                    `${moment(booking.start_time).add(moment().utcOffset(), 'minutes').format('MMM D, YYYY @ h:mma-')}` +
                    `${moment(booking.end_time).add(moment().utcOffset(), 'minutes').format('h:mma')}`
                  }
                  secondaryTypographyProps={{
                    className: booking.alreadyBooked ? classes.alreadyBookedText : ''
                  }}
                  />
                </ListItem>,
              )}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

CardBooker.defaultProps = {
  align: 'left',
};

CardBooker.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Whether to show custom shadow
   */
  withShadow: PropTypes.bool,
  /**
   * Whether to render the card without shadow
   */
  noShadow: PropTypes.bool,
  /**
   * Whether to hide the card borders
   */
  noBorder: PropTypes.bool,
  /**
   * Whether to show transparent background
   */
  noBg: PropTypes.bool,
  /**
   * Whether to lift up on hover
   */
  liftUp: PropTypes.bool,
  /**
   * The content alignment
   */
  align: PropTypes.oneOf(['left', 'right', 'center']),
};

export default CardBooker;
