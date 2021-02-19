import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import { Hero, ConcertPanel } from './components';

import Loading from '../../components/organisms/Loading';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useApp } from 'AppProvider';
import moment from 'moment';

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
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const app = useApp();

  const concertQuery = useQuery('concerts', async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/concerts`);
    return data;
  });

  useEffect(() => {
    app.setConcertSearchValue(null);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (concertQuery.data) {
      setData(concertQuery.data);
      setFilteredData(concertQuery.data);
      setLoading(false);
    }
  }, [concertQuery.data]);

  useEffect(() => {
    if (app.concertSearchValue) {
      const newFilteredata = data.filter(concert => moment(concert.concert_time).isSame(app.concertSearchValue, 'day'));
      setFilteredData(newFilteredata);
    } else if (data?.length > 0) {
      setFilteredData(data);
    }
    // eslint-disable-next-line
  }, [app.concertSearchValue]);

  return React.useMemo(() => {
    if (loading) {
      return <Loading />;
    }
    return (
      <div className={classes.root}>
        <Section className={classes.pagePaddingTop}>
          <Hero />
        </Section>
        <SectionAlternate>
          <div style={{ position: 'relative' }}>
            <ConcertPanel data={filteredData} />
          </div>
        </SectionAlternate>
      </div>
    );
  }, [classes, loading, filteredData]);
};

export default Browse;
