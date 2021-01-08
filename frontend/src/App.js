import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider } from '@material-ui/core/styles';
import AOS from 'aos';

import theme from './theme';
import Routes from './Routes';

import 'swiper/css/swiper.min.css';
import 'aos/dist/aos.css';
import './assets/scss/index.scss';
import { useApp } from './AppProvider';
import { useAuth0 } from './hooks/useAuth0';
import Loading from './components/organisms/Loading';
import CssBaseline from '@material-ui/core/CssBaseline';

const browserHistory = createBrowserHistory();

browserHistory.listen(location => {
  // Use setTimeout to make sure this runs after React Router's own listener
  setTimeout(() => {
    // Keep default behavior of restoring scroll position when user:
    // - clicked back button
    // - clicked on a link that programmatically calls `history.goBack()`
    // - manually changed the URL in the address bar (here we might want
    // to scroll to top, but we can't differentiate it from the others)
    if (location.action === 'POP') {
      return;
    }
    // In all other cases, scroll to top
    window.scrollTo(0, 0);
  });
});

const App = () => {
  const auth0 = useAuth0();
  const app = useApp();

  if (auth0.loading || app.loading) {
    return (
      <MuiThemeProvider theme={theme}>
        <Loading />
      </MuiThemeProvider>
    );
  }

  AOS.init({
    once: true,
    delay: 50,
    duration: 500,
    easing: 'ease-in-out',
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </MuiThemeProvider>
  );
};

export default App;