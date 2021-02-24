import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import { Hero, ArtistPanel } from './components';

import { useApp } from '../../AppProvider';
import Loading from '../../components/organisms/Loading';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
    },
  },
}));

const Browse = () => {
  const classes = useStyles();
  const app = useApp();
  const [firstLoad, setFirstLoad] = useState(true);
  const loading = app.searchResultsLoading;
  const { locationId, artistTypeId, artistGenreId } = useParams();

  useEffect(() => {
    if (app.loading) {
      return;
    }
    async function doInitialSearch() {
      app.handleSearch(locationId, artistTypeId, artistGenreId);
      setFirstLoad(false);
    }
    doInitialSearch();
  }, [locationId, artistTypeId, artistGenreId, app.loading]); //eslint-disable-line

  useEffect(() => {
    try {
      app.ReactPixel.pageView();
    } catch (error) {
      console.log('Error using ReactPixel.pageView: ', error);
    }
  }, [app.ReactPixel]);

  return React.useMemo(() => {
    return (
      <div className={classes.root}>
        <Section className={classes.pagePaddingTop}>
          <Hero />
        </Section>
        <SectionAlternate>
          <div style={{ position: 'relative' }}>
            {loading && <Loading position="top" faded />}
            <ArtistPanel firstLoad={firstLoad} data={app.searchResults} />
          </div>
        </SectionAlternate>
      </div>
    );
  }, [classes, firstLoad, loading, app.searchResults]);
};

export default Browse;
