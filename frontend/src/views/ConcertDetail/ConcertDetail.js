import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { SectionAlternate } from 'components/organisms';
import { Hero } from './components';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Loading from '../../components/organisms/Loading';
import VideoSection from './components/VideoSection';
import CustomEmbedSection from './components/CustomEmbedSection';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  appBarBottom: {
    top: 'auto',
    bottom: 0,
    background: 'transparent',
    boxShadow: 'none',
  },
  toolbarBottom: {
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
  },
  chatIconButton: {
    position: 'absolute',
    right: theme.spacing(3),
    left: 'auto',
    top: theme.spacing(-3),
    background: theme.palette.primary.main,
    width: 55,
    height: 55,
    boxShadow: '0 2px 10px 0 rgba(23,70,161,.11)',
    '&:hover': {
      background: theme.palette.primary.main,
    },
  },
  forumIcon: {
    color: 'white',
    width: 25,
    height: 25,
  },
  contactForm: {
    padding: theme.spacing(3, 2),
    maxWidth: 800,
    margin: '0 auto',
  },
}));

const ConcertDetail = () => {
  let { concertId } = useParams();
  if (!concertId) {
    concertId = 1;
  }

  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const concertDetailQuery = useQuery(`conceertDetailQuery$${concertId}`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/concerts/${concertId}`);
    return data;
  });

  useEffect(() => {
    console.log('concertDetailQuery.data', concertDetailQuery.data);
    if (concertDetailQuery.data) {
      console.log('concertQueryconcertQuery::', concertDetailQuery.data);
      setData(concertDetailQuery.data);
      setLoading(false);
    }
  }, [concertDetailQuery.data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={classes.root}>
      <Hero data={data} />

      {data.video_url && (
        <SectionAlternate>
          <VideoSection videoSrc={`https://www.youtube.com/embed/${data.video_url}`} />
        </SectionAlternate>
      )}
      {data.custom_embed && (
        <SectionAlternate>
          <CustomEmbedSection code={data.custom_embed} />
        </SectionAlternate>
      )}

      <Divider />
    </div>
  );
};

export default ConcertDetail;
