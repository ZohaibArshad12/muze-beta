import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Typography,
  Button,
  Grid,
  Divider,
  colors,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { CardProduct } from 'components/organisms';
import { SectionHeader } from '../../../../components/molecules';
import { useApp } from '../../../../AppProvider';
import { NavLink as RouterLink } from 'react-router-dom';
import { rating } from '../../../../utils';

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
  artistContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  artistGrid: {
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
    margin: theme.spacing(2, 0),
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

const ArtistPanel = props => {
  const { firstLoad, data, artists, className, ...rest } = props;
  const classes = useStyles();
  const app = useApp();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const [curMaxResults, setCurMaxResults] = useState(10);

  const handleShowMore = () => {
    setCurMaxResults(curMaxResults + 10);
  }

  const ArtistMediaContent = props => (
    <RouterLink
      to={`/artists/${props['artist-id']}`}
    >
      <Image
        lazy={false}
        {...props}
        className={classes.image}
        lazyProps={{ width: '100%', height: '100%' }}
      />
    </RouterLink>
  );

  const ArtistContent = ({ artist }) => (
    <div className={classes.artistContent}>
      <Typography variant="h5" color="textPrimary" gutterBottom>
        <RouterLink
          to={`/artists/${artist.id}`}
          style={{color: 'white'}}
        >
          {artist.name}
        </RouterLink>
      </Typography>
      {artist.rating !== null && (
        <div className={classes.ratingContainer}>
          {rating(artist.rating, classes.ratingIcon)}
        </div>
      )}
      <Typography variant="subtitle1" style={{ color: theme.palette.text.light }} gutterBottom>
        {artist.short_description}
      </Typography>
      <div className={classes.tags}>
        {[artist.ArtistType].map((item, index) => (
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
        {[...artist.ArtistGenres].map((item, index) => (
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
      <div style={{ flexGrow: 1 }} />
      <Divider className={classes.divider} />
      <div className={classes.list}>
        <Typography
          color="textPrimary"
          variant="h6"
          className={classes.rate}
        >
          <span>${artist.rate}</span> <span className={classes.rateCaption}>per 10 minutes</span>
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          component={CustomRouterLink}
          to={`/artists/${artist.id}`}
        >
          Book Now
        </Button>
      </div>
    </div>
  );

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2} className={classes.artistGrid}>
        {data.length === 0 && !firstLoad &&
        <Grid item xs={12} data-aos="fade-up" style={{ paddingTop: 40 }}>
          <SectionHeader
            title="No results"
            subtitle="We couldn't find any artists matching your search criteria."
            ctaGroup={[
              <Button
                variant="outlined"
                onClick={app.handleSearchAll}
              >
                View All Artists
              </Button>,
            ]}
          />
        </Grid>
        }
        {data.slice(0, curMaxResults).map((item, index) => (
          <Grid item xs={12} key={index} data-aos="fade-up">
            <CardProduct
              withShadow
              liftUp
              className={clsx(
                classes.cardProduct,
                //index % 2 !== 0 ? classes.cardProductReverse : {},
              )}
              mediaContent={
                <ArtistMediaContent artist-id={item.id} src={item.cover_img_url} alt={item.name} />
              }
              cardContent={
                <ArtistContent artist={item} />
              }
            />
          </Grid>
        ))}
        {data.length > curMaxResults &&
        <Grid item xs={12} data-aos="fade-up" style={{ paddingTop: 40, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleShowMore}
          >
            Show More
          </Button>
        </Grid>
        }
      </Grid>
    </div>
  );
};

ArtistPanel.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default ArtistPanel;
