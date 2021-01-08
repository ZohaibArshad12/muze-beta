import React, { useState } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Topbar, Footer, Sidebar } from './components';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    background: theme.palette.background.default,
  },
}));

const queryCache = new QueryCache();

const Admin = props => {
  const { children } = props;

  const classes = useStyles();

  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const open = isMd ? false : openSidebar;

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <div
        className={clsx({
          [classes.root]: true,
        })}
      >
        <CssBaseline />
        <Topbar onSidebarOpen={handleSidebarOpen} />
        <Sidebar
          onClose={handleSidebarClose}
          open={open}
          variant="temporary"
        />
        <main>{children}</main>
        <Footer />
      </div>
    </ReactQueryCacheProvider>
  );
};

Admin.propTypes = {
  children: PropTypes.node,
};

export default Admin;
