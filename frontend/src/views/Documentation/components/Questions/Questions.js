import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  colors, Typography,
} from '@material-ui/core';
import { IconAlternate } from 'components/molecules';
import { Accordion } from 'components/organisms';
import useTheme from '@material-ui/core/styles/useTheme';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    fontWeight: 'bold',
  },
  accordionGrid: {
    '& .accordion__item-wrapper': {
      boxShadow: '0 1.5rem 4rem rgba(22,28,45,.05)',
    },
  },
  fontWeightBold: {
    fontWeight: 'bold',
  },
  fontWeight300: {
    fontWeight: 300,
  },
  listItemAvatar: {
    marginRight: theme.spacing(2),
  },
  listItemText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  answerCount: {
    padding: theme.spacing(1 / 2, 1),
    borderRadius: theme.spacing(1),
    background: theme.palette.secondary.light,
    color: 'white',
    fontWeight: 700,
  },
}));

const Questions = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <List className={classes.root}>
            <ListItem disableGutters>
              <ListItemAvatar className={classes.listItemAvatar}>
                <IconAlternate
                  fontIconClass={data.icon}
                  size="medium"
                  color={colors.deepPurple[300]}
                  shape="circle"
                />
              </ListItemAvatar>
              <ListItemText
                primary={data.title}
                secondary={data.subtitle}
                primaryTypographyProps={{
                  variant: 'h6',
                }}
                secondaryTypographyProps={{
                  variant: 'h6',
                }}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h5'} gutterBottom>
            Installation
          </Typography>
          <Typography variant={'body1'}>
            <ol style={{marginLeft: theme.spacing(2)}}>
              <li>Login to your Zoom account and navigate to the Zoom Marketplace.</li>
              <li>Search for <strong>Muze Music</strong> and click the app.<br/>
                <i>Note: If the app is not pre-approved, please contact your Zoom admin to approve this app for your account.</i></li>
              <li>Click <strong>Install</strong>, confirm the permissions the app requires and choose <strong>Authorize</strong>.</li>
            </ol>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h5'} gutterBottom>
            Usage
          </Typography>
          <Typography variant={'body1'}>
            Muze Music allows you to book artists to play live performances over Zoom.
          </Typography>
        </Grid><Grid item xs={12}>
          <Typography variant={'h6'} gutterBottom>
            Booking An Artist
          </Typography>
          <Typography variant={'body1'}>
            <ol style={{marginLeft: theme.spacing(2)}}>
              <li>Navigate to the <strong>Muze Music</strong> app home page.</li>
              <li>Begin your search by specifying your event date, desired artist type, and genre.</li>
              <li>Click <strong>Search</strong> and select an artist from the results by clicking <strong>Book Now</strong>.</li>
              <li>Enter your event time and duration and click <strong>Book</strong>.</li>
              <li>Provide your contact information, event information, and Zoom meeting information and click <strong>Continue</strong>.</li>
              <li>Provide payment information and click <strong>Continue</strong>.</li>
              <li>Done! An e-mail will be sent to you with booking details. Enjoy!</li>
            </ol>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h5'} gutterBottom>
            Troubleshooting
          </Typography>
          <Typography variant={'body1'}>
            Please visit our <Link color="textSecondary" href="/help">Help</Link> section for troubleshooting assistance.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h5'} gutterBottom>
            Uninstall
          </Typography>
          <Typography variant={'body1'}>
            <ol style={{marginLeft: theme.spacing(2)}}>
              <li>Login to your Zoom account and navigate to the Zoom Marketplace.</li>
              <li>Click <strong>Manage > Installed Apps</strong> or search for the <strong>Muze Music</strong> app.</li>
              <li>Click <strong>Muze Music</strong> and click <strong>Uninstall</strong>.</li>
            </ol>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

Questions.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.object.isRequired,
};

export default Questions;
