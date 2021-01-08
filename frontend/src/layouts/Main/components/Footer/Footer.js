import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Grid,
  List,
  ListItem,
} from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import PinterestIcon from '@material-ui/icons/Pinterest';
import { Image } from 'components/atoms';
import { useApp } from '../../../../AppProvider';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(6, 0),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(12, 0),
    },
    background: theme.palette.background.footer,
  },
  footerContainer: {
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
  },
  logoContainerItem: {
    paddingTop: 0,
    paddingLeft: '13px'
  },
  logoContainer: {
    width: 93,
    height: 56,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  groupTitle: {
    textTransform: 'uppercase',
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(1),
  },
  socialIcon: {
    padding: 0,
    marginRight: theme.spacing(1),
    color: 'rgba(255,255,255,.6)',
    '&:hover': {
      background: 'transparent',
    },
    '&:last-child': {
      marginRight: 0,
    },
  },
  icon: {
    fontSize: 24,
  },
  menuListContainer: {
    padding: '0 !important',
  },
  menu: {
    display: 'flex',
  },
  menuItem: {
    margin: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  menuGroupItem: {
    paddingTop: 0,
    paddingBottom: theme.spacing(1 / 2),
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  menuGroupTitle: {
    textTransform: 'uppercase',
    color: 'white',
  },
  menuLegal: {
    color: 'rgba(255,255,255,.3)',
    marginTop: theme.spacing(4),
    fontSize: 11

  },
  divider: {
    width: '100%',
  },
  navLink: {
    color: 'rgba(255,255,255,.6)',
  },
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <RouterLink {...props} />
  </div>
));

const Footer = props => {
  const { className, ...rest } = props;

  const app = useApp();
  const data = app.data;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.footerContainer}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={2}>
            <List disablePadding>
              <ListItem disableGutters className={classes.logoContainerItem}>
                <div className={classes.logoContainer}>
                  <a href="/" title="MUZE">
                    <Image
                      className={classes.logoImage}
                      src="/images/logos/muze-logo.svg"
                      alt="MUZE"
                      lazy={false}
                    />
                  </a>
                </div>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={10} className={classes.menuListContainer}>
            <Grid container spacing={2}>
              <Grid item className={classes.listItem}>
                <div className={classes.menu}>
                  <div>
                    <List disablePadding className={classes.menuItem}>
                      <ListItem disableGutters className={classes.menuGroupItem}>
                        <Typography variant="body2" className={classes.menuGroupTitle}>
                          Pages
                        </Typography>
                      </ListItem>
                      {data.pages.length > 0 && data.pages.map((page, i) => (
                        <ListItem disableGutters key={i} className={classes.menuGroupItem}>
                          <Typography
                            variant="body2"
                            component={CustomRouterLink}
                            to={page.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                          >
                            {page.title}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.listItem}>
                <div className={classes.menu}>
                  <div>
                    <List disablePadding className={classes.menuItem}>
                      <ListItem disableGutters className={classes.menuGroupItem}>
                        <Typography variant="body2" className={classes.menuGroupTitle}>
                          Locations
                        </Typography>
                      </ListItem>
                      {data.locations.length > 0 && data.locations.map(location => ({
                        title: location.name,
                        id: location.name.toLowerCase(),
                        href: `/browse/location/${location.id}`
                      })).map((page, i) => (
                        <ListItem disableGutters key={i} className={classes.menuGroupItem}>
                          <Typography
                            variant="body2"
                            component={CustomRouterLink}
                            to={page.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                          >
                            {page.title}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.listItem}>
                <div className={classes.menu}>
                  <div>
                    <List disablePadding className={classes.menuItem}>
                      <ListItem disableGutters className={classes.menuGroupItem}>
                        <Typography variant="body2" className={classes.menuGroupTitle}>
                          Performers
                        </Typography>
                      </ListItem>
                      {data.artistTypes.length > 0 && data.artistTypes.map(artistType => ({
                        title: artistType.name,
                        id: artistType.name.toLowerCase(),
                        href: `/browse/artist-type/${artistType.id}`
                      })).map((page, i) => (
                        <ListItem disableGutters key={i} className={classes.menuGroupItem}>
                          <Typography
                            variant="body2"
                            component={CustomRouterLink}
                            to={page.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                          >
                            {page.title}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.listItem}>
                <div className={classes.menu}>
                  <div>
                    <List disablePadding className={classes.menuItem}>
                      <ListItem disableGutters className={classes.menuGroupItem}>
                        <Typography variant="body2" className={classes.menuGroupTitle}>
                          Genres
                        </Typography>
                      </ListItem>
                      {data.artistGenres.length > 0 && data.artistGenres.slice(0,6).map(artistGenre => ({
                        title: artistGenre.name,
                        id: artistGenre.name.toLowerCase(),
                        href: `/browse/genre/${artistGenre.id}`
                      })).map((page, i) => (
                        <ListItem disableGutters key={i} className={classes.menuGroupItem}>
                          <Typography
                            variant="body2"
                            component={CustomRouterLink}
                            to={page.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                          >
                            {page.title}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.listItem}>
                <div className={classes.menu}>
                  <div>
                    <List disablePadding className={classes.menuItem}>
                      <ListItem disableGutters className={classes.menuGroupItem}>
                        <Typography variant="body2" className={classes.menuGroupTitle}>
                          &nbsp;
                        </Typography>
                      </ListItem>
                      {data.artistGenres.length > 0 && data.artistGenres.slice(6,12).map(artistGenre => ({
                        title: artistGenre.name,
                        id: artistGenre.name.toLowerCase(),
                        href: `/browse/genre/${artistGenre.id}`
                      })).map((page, i) => (
                        <ListItem disableGutters key={i} className={classes.menuGroupItem}>
                          <Typography
                            variant="body2"
                            component={CustomRouterLink}
                            to={page.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                          >
                            {page.title}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.listItem}>
                <div className={classes.menu}>
                  <div>
                    <List disablePadding className={classes.menuItem}>
                      <ListItem disableGutters className={classes.menuGroupItem}>
                        <Typography variant="body2" className={classes.menuGroupTitle}>
                          &nbsp;
                        </Typography>
                      </ListItem>
                      {data.artistGenres.length > 0 && data.artistGenres.slice(12,18).map(artistGenre => ({
                        title: artistGenre.name,
                        id: artistGenre.name.toLowerCase(),
                        href: `/browse/genre/${artistGenre.id}`
                      })).map((page, i) => (
                        <ListItem disableGutters key={i} className={classes.menuGroupItem}>
                          <Typography
                            variant="body2"
                            component={CustomRouterLink}
                            to={page.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                          >
                            {page.title}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={2}>
            &nbsp;
          </Grid>
          <Grid item xs={12} md={10} className={classes.menuListContainer}>
                <List disablePadding className={classes.menuItem}>
                  <ListItem disableGutters className={classes.menuGroupItem}>
                    <Typography variant="body2" className={classes.menuLegal}>
                      &copy; {new Date().getFullYear()} {app.settings.company_name}. All Rights Reserved.
                    </Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <IconButton className={classes.socialIcon} target="_blank" href="https://www.facebook.com/muzemusicinc">
                      <FacebookIcon className={classes.icon}/>
                    </IconButton>
                    <IconButton className={classes.socialIcon} target="_blank" href="https://www.instagram.com/muzemusicinc/">
                      <InstagramIcon className={classes.icon} />
                    </IconButton>
                    <IconButton className={classes.socialIcon} target="_blank" href="https://twitter.com/muzemusicinc">
                      <TwitterIcon className={classes.icon} />
                    </IconButton>
                    <IconButton className={classes.socialIcon} target="_blank" href="https://www.pinterest.com/muzemusic/">
                      <PinterestIcon className={classes.icon} />
                    </IconButton>
                  </ListItem>
                </List>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
