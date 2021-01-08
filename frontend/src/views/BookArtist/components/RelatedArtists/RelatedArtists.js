import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import {
  useMediaQuery,
  Grid,
  Typography,
  Button,
  colors,
  Avatar,
} from '@material-ui/core';
import { LearnMoreLink } from 'components/atoms';
import { SectionHeader, SwiperImage } from 'components/molecules';
import { CardProduct } from 'components/organisms';
import { rating } from '../../../../utils';

const useStyles = makeStyles(theme => ({
  root: {},
  swiperNavButton: {
    width: `${theme.spacing(3)}px !important`,
    height: `${theme.spacing(3)}px !important`,
    padding: `${theme.spacing(2)}px !important`,
  },
  locationCardPrice: {
    padding: theme.spacing(1),
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    background: 'black',
    borderRadius: theme.spacing(1),
    zIndex: 3,
  },
  fontWeight700: {
    fontWeight: 700,
  },
  locationCardReviewAvatar: {
    marginLeft: theme.spacing(-2),
    border: '3px solid white',
    '&:first-child': {
      marginLeft: 0,
    },
  },
  locationCardReviewStar: {
    color: colors.yellow[800],
    marginRight: theme.spacing(1 / 2),
  },
  reviewCount: {
    marginLeft: theme.spacing(1),
  },
  image: {
    borderBottomLeftRadius: '40%',
  },
  ratingContainer: {
    margin: theme.spacing(2, 0),
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
    fontSize: '.7rem',
    alignSelf: 'center',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.light
  }
}));

const RelatedArtists = props => {
  const { data, className, artist, relatedArtists, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  useEffect(() => {
    console.log(relatedArtists);
  }, [relatedArtists]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <SectionHeader
        title={
          <span>
            More artists like {artist.name}
          </span>
        }
        subtitle="We think you'll enjoy your experience booking with these related artists."
        ctaGroup={[
          <Button
            variant="outlined"
            size={isMd ? 'large' : 'medium'}
            color="default"
          >
            Browse All Artists
          </Button>,
        ]}
        fadeUp
      />
      <Grid container spacing={2}>
        {relatedArtists.length > 0 && [...relatedArtists].map((item, index) => (
          <Grid key={index} item xs={12} sm={12} md={4} data-aos="fade-up">
            <CardProduct
              withShadow
              liftUp
              mediaContent={
                <>
                  <SwiperImage
                    navigationButtonStyle={classes.swiperNavButton}
                    items={item.images || []}
                    imageClassName={classes.image}
                  />
                  <div className={classes.locationCardPrice}>
                    <Typography
                      color="textPrimary"
                      variant="h6"
                      className={classes.rate}
                    >
                      <span>${item.rate}</span> <span className={classes.rateCaption}>per 10 minutes</span>
                    </Typography>
                  </div>
                </>
              }
              cardContent={
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      color="textPrimary"
                      align="left"
                      className={classes.fontWeight700}
                    >
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="left"
                    >
                      {item.short_description.substring(0, 100)}...
                    </Typography>
                  </Grid>
                  <Grid item container justify="space-between" xs={12}>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justify="flex-start"
                      xs={12}
                    >
                      {item.rating !== null && (
                        <>
                          <div className={classes.ratingContainer}>
                            {rating(item.rating, classes.ratingIcon)}
                          </div>
                          <Typography
                            component="span"
                            variant="body1"
                            className={classes.fontWeight700}
                          >
                            {item.rating}
                          </Typography>
                          <Typography
                            noWrap
                            component="span"
                            variant="body2"
                            color="textSecondary"
                            style={{color: theme.palette.text.light}}
                            className={classes.reviewCount}
                          >
                            ({item.reviewCount || 0} reviews)
                          </Typography>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item container justify="flex-start" xs={12}>
                    <LearnMoreLink variant={'subtitle1'} color={"secondary"} typographyProps={{style:{color: 'white'}}} title="More Details" />
                  </Grid>
                </Grid>
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Location.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default RelatedArtists;
