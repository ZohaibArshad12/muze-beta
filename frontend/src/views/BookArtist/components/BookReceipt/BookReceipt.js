import React, { forwardRef, useEffect, useState } from 'react';
import { Button, Grid, Typography, useMediaQuery } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import { makeStyles } from '@material-ui/core/styles';
import { useApp } from '../../../../AppProvider';
import moment from 'moment';
import { NavLink as RouterLink } from 'react-router-dom';
import PrintIcon from '@material-ui/icons/Print';

const useStyles = makeStyles(theme => ({
  root: {},
  form: {
    maxWidth: 550,
    margin: `0 auto`,
    marginTop: theme.spacing(5),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(10),
    },
    backgroundColor: theme.palette.background.topnav,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
  },
  label: {
    color: theme.palette.text.light,
  },
  confNum: {
    fontSize: '2rem'
  },
  receiptLink: {
    color: theme.palette.text.secondary
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <span ref={ref}>
    <RouterLink {...props} />
  </span>
));

const BookReceipt = props => {
  const { data } = props;
  const classes = useStyles();
  const app = useApp();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  // copy existing app booking data
  const [bookingData] = useState(app.bookFormValues);

  // then erase it all for privacy reasons
  useEffect(() => {
    app.handleResetBookFormValues();
  }, []); //eslint-disable-line
  
  return (
    <div className={classes.form}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            align="center"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Confirmation Code</span><br />
            <span className={classes.confNum}>{bookingData.confNum}</span>
          </Typography>
        </Grid>
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
            {bookingData.firstname} {bookingData.lastname}<br />
            {bookingData.email}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Address</span><br />
            {bookingData.address1}<br />
            {bookingData.address2 && (
              <>{bookingData.address2}<br /></>
            )}
            {bookingData.city}, {bookingData.state} {bookingData.zipcode}
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
            {bookingData.bookDuration.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Date</span><br />
            {moment(bookingData.bookDate).format('dddd, MMMM Do, YYYY')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Time</span><br />
            {moment(bookingData.bookTime).format('LT')} - {moment(bookingData.bookTime).add(bookingData.bookDuration.value, 'minutes').format('LT')}
          </Typography>
        </Grid>
        {bookingData.eventStyle && (
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              <span className={classes.label}>Event Style</span><br />
              {bookingData.eventStyle}
            </Typography>
          </Grid>
        )}
        {bookingData.songRequests && (
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              <span className={classes.label}>Song Requests</span><br />
              {bookingData.songRequests}
            </Typography>
          </Grid>
        )}
        {bookingData.specialRequests && (
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              <span className={classes.label}>Special Requests</span><br />
              {bookingData.specialRequests}
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
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Zoom Meeting ID</span><br />
            {bookingData.zoomMeetingId}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Zoom Meeting Passcode</span><br />
            {bookingData.zoomMeetingPasscode}
          </Typography>
        </Grid>
        <Grid item xs={12} data-aos="fade-up">
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Payment Information
          </Typography>
        </Grid>
        <Grid item xs={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Card</span><br />
            {bookingData.ccBrand} x{bookingData.ccLast4}
          </Typography>
        </Grid>
        {bookingData.ccReceiptNumber && (
          <Grid item xs={6} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              <span className={classes.label}>Receipt Number</span><br />
              #{bookingData.ccReceiptNumber}
            </Typography>
          </Grid>
        )}
        <Grid item xs={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Total Amount</span><br />
            ${bookingData.feeTotal}
          </Typography>
        </Grid>
        <Grid item xs={6} data-aos="fade-up">
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            <span className={classes.label}>Receipt Link</span><br />
            <a
              href={bookingData.ccReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.receiptLink}
            >
              View Receipt
            </a>
          </Typography>
        </Grid>
        <Grid item container justify="center" xs={12}>
          <Button
            variant="outlined"
            type="submit"
            size="large"
            onClick={() => window.print()}
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
        </Grid>
        <Grid item container justify="center" xs={12}>
          <Button
            variant="contained"
            type="submit"
            size="large"
            color="secondary"
            component={CustomRouterLink}
            to="/browse"
          >
            Continue Browsing
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BookReceipt;