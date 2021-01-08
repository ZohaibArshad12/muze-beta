import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Grid, Typography } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { HeroShaped, Map } from 'components/organisms';
import { useTheme } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {},
  placementGrid: {
    display: 'flex',
  },
  placementGridItemMiddle: {
    margin: `0 ${theme.spacing(3)}px`,
  },
  map: {
    zIndex: 9,
  },
}));

const MapHero = props => {
  const { data, className, artist, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <HeroShaped
        leftSide={
          <Grid container spacing={1} data-aos="fade-up">
            <Grid item xs={12}>
              <SectionHeader
                label="locations"
                title={
                  <span>
                    Our Location
                  </span>
                }
                subtitle={`${artist.name} is based out of`}
                align="left"
                fadeUp
                disableGutter
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.placementGrid}>
                <div className="countup-number__wrapper">
                  <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    color={'secondary'}
                    style={{color: theme.palette.text.light}}
                    className="countup-number__count-wrapper"
                    >
                    Redding, CA, United States
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        }
        rightSide={
          <Map
            center={[40.5825698,-122.4054127]}
            zoom={6}
            pins={data}
            className={classes.map}
          />
        }
      />
    </div>
  );
};

MapHero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default MapHero;
