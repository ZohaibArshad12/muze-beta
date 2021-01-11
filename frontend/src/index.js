import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { Auth0Provider } from './hooks/useAuth0';
import { AppProvider } from './AppProvider';
import * as serviceWorker from './serviceWorker';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
let stripePromise;
if (process.env.STRIPE_KEY) {
  stripePromise = loadStripe(process.env.STRIPE_KEY);
} else {
  stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
}

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      client_id={process.env.REACT_APP_CLIENTID}
      redirect_uri={window.location.origin}
      audience={process.env.REACT_APP_AUDIENCE}
      onRedirectCallback={onRedirectCallback}
    >
      <AppProvider>
        <App />
      </AppProvider>
    </Auth0Provider>
  </Elements>,
  document.getElementById('root'));

serviceWorker.unregister();
