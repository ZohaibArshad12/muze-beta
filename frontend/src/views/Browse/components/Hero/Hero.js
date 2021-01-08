import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import ArtistSearchBar from '../../../../components/organisms/ArtistSearchBar';

const useStyles = makeStyles(theme => ({
  root: {
    background: `url('/images/photos/browse/neon-guitar-bg.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top'
  },
  image: {
    width: 204,
    height: 300,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
    },
  },
  highlightedText: {
    color: theme.palette.secondary.main,
  },
  searchInputContainer: {
    width: '100%',
    height: '100%',
    marginBottom: theme.spacing(4)
  },
  input: {
    background: 'white',
  },
  searchButton: {
    maxHeight: 45,
    minWidth: 135,
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
    },
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    padding: theme.spacing(1 / 2, 1),
    borderRadius: theme.spacing(1 / 2),
    background: theme.palette.secondary.light,
    color: 'white',
    margin: theme.spacing(0, 1, 1, 0),
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 2, 2, 0),
    },
  },
}));

const Hero = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container justify="space-between" spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={6} data-aos={'fade-up'}>
          <SectionHeader
            title={
              <span>
                Elevate your Zoom meeting with a{' '}
                <span className={classes.highlightedText}>
                  live music performance.
                </span>
              </span>
            }
            subtitle="To get started simply choose your location, desired date, or performer type. We've hand-picked each artist to ensure you have an amazing experience."
            subtitleProps={{
              style:{color: theme.palette.text.light}
            }}
            align={isMd ? 'left' : 'center'}
            disableGutter
            titleVariant="h3"
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.searchInputContainer} data-aos="fade-up">
            <ArtistSearchBar withShadow noBorder thinner light />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Hero;
