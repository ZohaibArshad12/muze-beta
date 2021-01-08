import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Book,
} from './components';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Loading from '../../components/organisms/Loading';
import { Breadcrumb } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  sectionBreadcrumb: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
  },
}));

const BookArtist = () => {
  let { artistId } = useParams();
  if (!artistId) {
    artistId = 1;
  }

  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const breadcrumb = [
    {
      href: '/',
      title: 'Home',
      isActive: false,
    },
    {
      href: '/browse',
      title: 'Browse',
      isActive: false,
    },
    {
      href: `/artists/${artistId}`,
      title: data.name || 'Artist',
      isActive: false,
    },
    {
      href: `/artists/book/${artistId}`,
      title: 'Book',
      isActive: true,
    },
  ];

  const artistQuery = useQuery(`artistQuery${artistId}`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/artists/${artistId}`);
    return data;
  });

  useEffect(() => {
    if (artistQuery.data) {
      setData((prevState) => {
        return Object.assign({}, prevState, artistQuery.data);
      });
      setLoading(false);
    }
  }, [artistQuery.data]);

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className={classes.root}>
      <Section className={classes.sectionBreadcrumb}>
        <Breadcrumb data={breadcrumb} />
      </Section>
      <SectionAlternate>
        <Book data={data} />
      </SectionAlternate>
    </div>
  );
};

export default BookArtist;
