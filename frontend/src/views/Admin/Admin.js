import React from 'react';
import { useParams, Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Box, List, ListItem, Grid, Typography } from '@material-ui/core';
import { SectionAlternate, CardBase } from 'components/organisms';
import { Hero, Artists, ArtistTypes, ArtistGenres, Locations, Reviews } from './components';
import Bookings from './components/Bookings';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  section: {
    '& .section-alternate__content': {
      paddingTop: 0,
      marginTop: theme.spacing(-5),
      position: 'relative',
      zIndex: 1,
    },
    '& .card-base__content': {
      padding: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3),
      },
    },
  },
  menu: {
    height: 'auto',
  },
  list: {
    display: 'inline-flex',
    overflow: 'auto',
    flexWrap: 'nowrap',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      marginRight: theme.spacing(-3),
      marginLeft: theme.spacing(-3),
    },
  },
  listItem: {
    marginRight: theme.spacing(2),
    flex: 0,
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      borderLeft: '2px solid transparent',
    },
  },
  listItemActive: {
    [theme.breakpoints.up('md')]: {
      borderLeft: `2px solid ${theme.palette.primary.dark}`,
    },
    '& .menu__item': {
      color: theme.palette.text.primary,
    },
  },
}));

const subPages = [
  {
    id: 'artists',
    href: '/admin/artists',
    title: 'Artists',
    subtitle: 'Manage artist details'
  },
  {
    id: 'artist-types',
    href: '/admin/artist-types',
    title: 'Artist Types',
    subtitle: 'Manage artist types'
  },
  {
    id: 'artist-genres',
    href: '/admin/artist-genres',
    title: 'Genres',
    subtitle: 'Manage genres'
  },
  {
    id: 'locations',
    href: '/admin/locations',
    title: 'Locations',
    subtitle: 'Manage available locations'
  },
  {
    id: 'reviews',
    href: '/admin/reviews',
    title: 'Reviews',
    subtitle: 'Moderate artist reviews'
  },
  {
    id: 'bookings',
    href: '/admin/bookings',
    title: 'Bookings',
    subtitle: 'Manage bookings'
  }
];

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Box style={{width: "100%"}} component="div" hidden={value !== index} {...other}>
      {value === index && children}
    </Box>
  );
};

const Admin = () => {
  const classes = useStyles();

  let { pageId } = useParams();
  if (!pageId) {
    pageId = 'artists';
  }

  const getSubPageById = (id) => {
    return subPages.find(x => x.id === id);
  }

  return (
    <div className={classes.root}>
      <Hero page={getSubPageById(pageId)} />
      <SectionAlternate className={classes.section}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <CardBase withShadow align="left" className={classes.menu}>
              <List disablePadding className={classes.list}>
                {subPages.map((item, index) => (
                  <ListItem
                    key={index}
                    component={Link}
                    to={item.href}
                    className={clsx(
                      classes.listItem,
                      pageId === item.id ? classes.listItemActive : {},
                    )}
                    disableGutters
                  >
                    <Typography
                      variant="subtitle1"
                      noWrap
                      color="textSecondary"
                      className="menu__item"
                    >
                      {item.title}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardBase>
          </Grid>
          <Grid item xs={12} md={9}>
            <CardBase withShadow align="left">
              <TabPanel value={pageId} index={'artists'}>
                <Artists />
              </TabPanel>
              <TabPanel value={pageId} index={'artist-types'}>
                <ArtistTypes />
              </TabPanel>
              <TabPanel value={pageId} index={'artist-genres'}>
                <ArtistGenres />
              </TabPanel>
              <TabPanel value={pageId} index={'locations'}>
                <Locations />
              </TabPanel>
              <TabPanel value={pageId} index={'reviews'}>
                <Reviews />
              </TabPanel>
              <TabPanel value={pageId} index={'bookings'}>
                <Bookings />
              </TabPanel>
            </CardBase>
          </Grid>
        </Grid>
      </SectionAlternate>
    </div>
  );
};

export default Admin;
