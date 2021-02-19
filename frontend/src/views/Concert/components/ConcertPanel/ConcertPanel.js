import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Typography, Button, Grid, Divider, colors } from '@material-ui/core';
import { Image } from 'components/atoms';
import { CardProduct } from 'components/organisms';
import { SectionHeader } from '../../../../components/molecules';
import { useApp } from '../../../../AppProvider';
import { NavLink as RouterLink } from 'react-router-dom';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {},
  cardProduct: {
    display: 'flex',
    height: '100%',
    borderRadius: theme.spacing(1),
    '& .card-product__content, & .card-product__media': {
      flex: '1 1 50%',
      height: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column !important',
      '& .card-product__content, & .card-product__media': {
        flex: '1 1 100%',
      },
    },
  },
  cardProductReverse: {
    flexDirection: 'row-reverse',
    '& .card-product__media img': {
      borderRadius: theme.spacing(0, 0, 0, 20),
    },
  },
  image: {
    objectFit: 'cover',
    borderRadius: theme.spacing(0, 0, 20, 0),
  },
  concertContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  concertGrid: {
    '& .MuiGrid-item:first-child': {
      paddingTop: 0,
    },
  },
  list: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  dateAndTime: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
    '& a': {
      display: 'block',
    },
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
  fontWeightBold: {
    fontWeight: 'bold',
  },
  ratingContainer: {
    margin: theme.spacing(2, 0),
  },
  rateSection: {
    display: 'flex',
    flexDirection: 'column',
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
  moreInfo: {
    fontSize: '.8rem',
    textDecoration: 'underline',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: theme.palette.text.light,
    cursor: 'pointer',
  },
  ratingIcon: {
    color: colors.yellow[700],
    marginRight: theme.spacing(1 / 2),
  },
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <RouterLink {...props} />
  </div>
));

const ConcertPanel = props => {
  const { firstLoad, data, concerts, className, ...rest } = props;
  const classes = useStyles();
  const app = useApp();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const [curMaxResults, setCurMaxResults] = useState(10);

  const handleShowMore = () => {
    setCurMaxResults(curMaxResults + 10);
  };

  const ConcertMediaContent = props => (
    <RouterLink to={`/concerts/${props['concert-id']}`}>
      <Image lazy={false} {...props} className={classes.image} lazyProps={{ width: '100%', height: '100%' }} />
    </RouterLink>
  );

  const ConcertContent = ({ concert }) => (
    <div className={classes.concertContent}>
      <Typography variant="h5" color="textPrimary" gutterBottom>
        <RouterLink to={`/concerts/${concert.id}`} style={{ color: 'white' }}>
          {concert.name}
        </RouterLink>
      </Typography>

      <Typography className={classes.dateAndTime} variant="h5" color="textPrimary" gutterBottom>
        <span>
          {moment(concert.concert_time)
            .add(moment().utcOffset(), 'minutes')
            .format('MMM. D, YYYY ')}
        </span>
        <span>
          {' '}
          {moment(concert.concert_time)
            .add(moment().utcOffset(), 'minutes')
            .format('h:m A')}
        </span>
      </Typography>

      <Typography variant="subtitle1" color="textPrimary" gutterBottom>
        {concert.short_description}
      </Typography>

      <div style={{ flexGrow: 1 }} />
      <Divider className={classes.divider} />
      <div className={classes.list}>
        <div className={classes.rateSection}>
          <Typography color="textPrimary" variant="h6" className={classes.rate}>
            <span>${concert.rate}</span> <span className={classes.rateCaption}>per ticket</span>
          </Typography>
          <Typography component={CustomRouterLink} to={`/concerts/${concert.id}`} className={classes.moreInfo}>
            more info
          </Typography>
        </div>
        <Button href={concert.on_zoom_url} target="_blank" variant="contained" color="secondary">
          Buy Now
        </Button>
      </div>
    </div>
  );

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2} className={classes.concertGrid}>
        {data.length === 0 && !firstLoad && (
          <Grid item xs={12} data-aos="fade-up" style={{ paddingTop: 40 }}>
            <SectionHeader
              title="No results"
              subtitle="We couldn't find any concerts matching your search criteria."
              ctaGroup={[
                <Button variant="outlined" onClick={() => app.setConcertSearchValue(null)}>
                  View All Concerts
                </Button>,
              ]}
            />
          </Grid>
        )}
        {data.slice(0, curMaxResults).map((item, index) => (
          <Grid item xs={12} key={index} data-aos="fade-up">
            <CardProduct
              withShadow
              liftUp
              className={clsx(
                classes.cardProduct
                //index % 2 !== 0 ? classes.cardProductReverse : {},
              )}
              mediaContent={<ConcertMediaContent concert-id={item.id} src={item.cover_img_url} alt={item.name} />}
              cardContent={<ConcertContent concert={item} />}
            />
          </Grid>
        ))}
        {data.length > curMaxResults && (
          <Grid item xs={12} data-aos="fade-up" style={{ paddingTop: 40, textAlign: 'center' }}>
            <Button variant="outlined" onClick={handleShowMore}>
              Show More
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

ConcertPanel.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default ConcertPanel;
