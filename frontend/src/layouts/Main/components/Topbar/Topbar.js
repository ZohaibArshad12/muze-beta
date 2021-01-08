import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Hidden,
  List,
  ListItem,
  Typography,
  IconButton,
  Button,
  colors,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { Image } from 'components/atoms';
import { useApp } from '../../../../AppProvider';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    background: theme.palette.background.topnav,
    borderBottom: `1px solid ${colors.grey[800]}`,
  },
  flexGrow: {
    flexGrow: 1,
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbar: {
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
  },
  navLink: {
    fontWeight: 300,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
  listItem: {
    cursor: 'pointer',
    '&:hover > .menu-item, &:hover svg': {
      color: theme.palette.text.primary,
    },
  },
  listItemActive: {
    color: `${theme.palette.text.primary} !important`,
  },
  listItemText: {
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
    color: theme.palette.text.link,
    whiteSpace: 'nowrap',
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
  listItemIcon: {
    minWidth: 'auto',
  },
  popover: {
    padding: theme.spacing(4),
    border: theme.spacing(2),
    boxShadow: '0 0.5rem 2rem 2px rgba(116, 123, 144, 0.09)',
    minWidth: 350,
    marginTop: theme.spacing(2),
  },
  iconButton: {
    padding: 0,
    '&:hover': {
      background: 'transparent',
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    color: theme.palette.text.primary,
  },
  logoContainer: {
    width: 93,
    height: 56,
    [theme.breakpoints.up('md')]: {
      width: 93,
      height: 56,
    },
  },
  logoImage: {
    width: '80%',
    height: '100%',
  },
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  menuItem: {
    marginRight: theme.spacing(5),
    '&:last-child': {
      marginRight: 0,
    },
  },
  menuGroupItem: {
    paddingTop: 0,
  },
  menuGroupTitle: {
    textTransform: 'uppercase',
  },
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <RouterLink {...props} />
  </div>
));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const app = useApp();
  const data = app.data;

  return (
    <AppBar
      {...rest}
      position="relative"
      className={clsx(classes.root, className)}
    >
      <Toolbar disableGutters className={classes.toolbar}>
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
        <div className={classes.flexGrow} />
        <Hidden smDown>
          <List className={classes.navigationContainer}>
            {data.pages.filter(x => x.primary).map((page, i) => (
              <div key={page.id}>
                <ListItem
                    aria-describedby={page.id}
                    className={clsx(
                        classes.listItem,
                    )}
                >
                  <Typography
                      variant="body1"
                      component={CustomRouterLink}
                      to={page.href}
                      className={clsx(
                        classes.listItemText,
                        window.location.pathname === page.href ? classes.listItemActive : '',
                        'menu-item',
                      )}
                  >
                    {page.title}
                  </Typography>
                </ListItem>
              </div>
            ))}
            <ListItem className={classes.listItem}>
              <Button
                size="large"
                variant="contained"
                color="secondary"
                component={CustomRouterLink}
                to={data.pages.find(x => x.id === 'browse').href}
                style={{whiteSpace: "nowrap"}}
              >
                Book Now
              </Button>
            </ListItem>
          </List>
        </Hidden>
        <Hidden mdUp>
          <IconButton
            className={classes.iconButton}
            onClick={onSidebarOpen}
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
};

export default Topbar;
