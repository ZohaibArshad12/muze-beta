import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { useAuth0 } from "../../hooks/useAuth0";
import { AdminProvider } from '../../AdminProvider';

const PrivateRoute = ({ layout: Layout, component: Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: path },
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  const render = (props) =>
    isAuthenticated === true ? <AdminProvider><Layout><Component {...props} /></Layout></AdminProvider> : null;

  return <Route path={path} render={render} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default PrivateRoute;
