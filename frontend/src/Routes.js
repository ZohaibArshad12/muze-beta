import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './common';
import { Main as MainLayout } from './layouts';
import { Admin as AdminLayout } from './layouts';

import {
  Home as HomeView,
  Browse as BrowseView,
  ArtistDetail as ArtistDetailView,
  BookArtist as BookArtistView,
  About as AboutView,
  Help as HelpView,
  Documentation as DocumentationView,
  Privacy as PrivacyView,
  Terms as TermsView,
  NotFound as NotFoundView,
  Admin as AdminView,
  ZoomRedirect as ZoomRedirectView
} from './views';
import PrivateRoute from './common/PrivateRoute';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/home" to="/" />
      <Redirect exact from="/deauthorize" to="/" />
      <RouteWithLayout
        component={HomeView}
        exact
        layout={MainLayout}
        path="/"
      />
      <RouteWithLayout
        component={BrowseView}
        exact
        layout={MainLayout}
        path="/browse"
      />
      <RouteWithLayout
        component={BrowseView}
        exact
        layout={MainLayout}
        path="/browse/location/:locationId"
      />
      <RouteWithLayout
        component={BrowseView}
        exact
        layout={MainLayout}
        path="/browse/artist-type/:artistTypeId"
      />
      <RouteWithLayout
        component={BrowseView}
        exact
        layout={MainLayout}
        path="/browse/genre/:artistGenreId"
      />
      <RouteWithLayout
        component={ArtistDetailView}
        exact
        layout={MainLayout}
        path="/artists/:artistId"
      />
      <RouteWithLayout
        component={BookArtistView}
        exact
        layout={MainLayout}
        path="/artists/book/:artistId"
      />
      <RouteWithLayout
        component={ZoomRedirectView}
        exact
        layout={MainLayout}
        path="/redirect"
      />
      <RouteWithLayout
        component={AboutView}
        exact
        layout={MainLayout}
        path="/about"
      />
      <RouteWithLayout
        component={HelpView}
        exact
        layout={MainLayout}
        path="/help"
      />
      <RouteWithLayout
        component={DocumentationView}
        exact
        layout={MainLayout}
        path="/documentation"
      />
      <RouteWithLayout
        component={PrivacyView}
        exact
        layout={MainLayout}
        path="/privacy"
      />
      <RouteWithLayout
        component={TermsView}
        exact
        layout={MainLayout}
        path="/terms"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MainLayout}
        path="/not-found"
      />

      <PrivateRoute
        component={AdminView}
        exact
        layout={AdminLayout}
        path="/admin/:pageId?"
      />
      <Redirect to="/not-found" status="404" />
    </Switch>
  );
};

export default Routes;
