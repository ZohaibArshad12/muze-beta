import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Box, Button, Typography } from '@material-ui/core';
import { SectionHeader, SwiperImage } from 'components/molecules';
import { HeroShaped } from 'components/organisms';

import { getArtistImageArrayFromObject as getConcertImageArrayFromObject } from '../../../../utils';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';

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
    fontSize: '1em',
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
  dateAndTime: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
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
  swiper: {
    borderBottomLeftRadius: '40%',
  },
}));

const Hero = ({ data, ...props }) => {
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
                <span>{data.name}</span>
              </>
            }
            subtitle={
              <div style={{ paddingRight: theme.spacing(2) }}>
                <Typography className={classes.dateAndTime} variant="h5" color="textPrimary" gutterBottom>
                  <span>
                    {moment(data.concert_time)
                      .add(moment().utcOffset(), 'minutes')
                      .format('MMM. D, YYYY ')}
                  </span>
                  <span>
                    {moment(data.concert_time)
                      .add(moment().utcOffset(), 'minutes')
                      .format('h:m A')}
                  </span>
                </Typography>
                {data.short_description}
              </div>
            }
            subtitleExtra={
              <>
                <Divider style={{ margin: theme.spacing(2, 4, 3, 0) }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography color="textPrimary" variant="h4" className={classes.rate}>
                    <span>${data.rate}</span> <span className={classes.rateCaption}>per ticket</span>
                  </Typography>
                  <Button href={data.on_zoom_url} target="_blank" variant="contained" color="secondary">
                    Buy Now
                  </Button>
                </Box>
              </>
            }
            subtitleProps={{ style: { color: theme.palette.text.light } }}
            align="left"
            titleVariant="h3"
          />
        }
        rightSide={
          <SwiperImage
            className={classes.swiper}
            navigationButtonStyle={classes.swiperNavButton}
            items={getConcertImageArrayFromObject(data)}
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
