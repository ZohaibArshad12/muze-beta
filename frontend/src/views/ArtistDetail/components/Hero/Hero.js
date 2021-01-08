import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { colors, Typography } from '@material-ui/core';
import { SectionHeader, SwiperImage } from 'components/molecules';
import { HeroShaped } from 'components/organisms';

import { getArtistImageArrayFromObject, rating } from '../../../../utils';
import Divider from '@material-ui/core/Divider';
import { NavLink as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  swiperNavButton: {
    width: `${theme.spacing(3)}px !important`,
    height: `${theme.spacing(3)}px !important`,
    padding: `${theme.spacing(2)}px !important`,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3),
    fontSize: '1em'
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
  ratingContainer: {
    margin: theme.spacing(2, 0, 0),
    fontSize: '24px'
  },
  ratingIcon: {
    color: colors.yellow[700],
    marginRight: theme.spacing(1 / 2),
  },
  rate: {
    fontWeight: 'bold',
    display: 'flex',
    "& span": {
      display: 'block'
    }
  },
  rateCaption: {
    fontSize: '.8rem',
    alignSelf: 'center',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.light
  },
  swiper: {
    borderBottomLeftRadius: '40%',
  },
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <RouterLink {...props} />
  </div>
));

const Hero = ({data, ...props}) => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <HeroShaped
        leftSide={
          <SectionHeader
            title={
              <>
                <span>
                  {data.name}
                </span>
                {data.rating !== null && (
                  <div className={classes.ratingContainer}>
                    {rating(data.rating, classes.ratingIcon)}
                  </div>
                )}
              </>
            }
            subtitle={
              <div style={{paddingRight: theme.spacing(2)}}>{data.short_description}</div>
            }
            subtitleExtra={
              <>
                <div className={classes.tags}>
                  {[data.ArtistType].map((item, index) => (
                    <Typography
                      variant="caption"
                      color="primary"
                      className={classes.tag}
                      key={index}
                      component={CustomRouterLink}
                      to={`/browse/artist-type/${item.id}`}
                    >
                      {item.name.toLowerCase()}
                    </Typography>
                  ))}
                  {[...data.ArtistGenres].map((item, index) => (
                    <Typography
                      variant="caption"
                      color="primary"
                      className={classes.tag}
                      key={index}
                      component={CustomRouterLink}
                      to={`/browse/genre/${item.id}`}
                    >
                      {item.name.toLowerCase()}
                    </Typography>
                  ))}
                </div>
                <Divider style={{ margin: theme.spacing(2, 4, 3, 0)}}/>
                <Typography
                  color="textPrimary"
                  variant="h4"
                  className={classes.rate}
                >
                  <span>${data.rate}</span> <span className={classes.rateCaption}>per 10 minutes</span>
                </Typography>
              </>
            }
            subtitleProps={{style:{ color: theme.palette.text.light }}}
            align="left"
            titleVariant="h3"
          />
        }
        rightSide={
          <SwiperImage
            className={classes.swiper}
            navigationButtonStyle={classes.swiperNavButton}
            items={getArtistImageArrayFromObject(data)}
          />
        }
      />
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
