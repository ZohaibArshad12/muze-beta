import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Advantages,
  Hero,
  Reviews,
  Detail,
  MapHero,
} from './components';
import { reviews, mapData, locations } from './data';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Loading from '../../components/organisms/Loading';
import RelatedArtists from './components/RelatedArtists';
import VideoSection from './components/VideoSection';
import { getArtistImageArrayFromObject } from '../../utils';
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

const ArtistDetail = () => {
  let { artistId } = useParams();
  if (!artistId) {
    artistId = 1;
  }

  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedData, setRelatedData] = useState([]);

  const artistQuery = useQuery(`artistQuery${artistId}`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/artists/${artistId}`);
    return data;
  });

  const relatedArtistQuery = useQuery(`relatedArtistQuery${artistId}`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/artists/related-to/${artistId}`);
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

  useEffect(() => {
    if (relatedArtistQuery.data) {

      const myData = relatedArtistQuery.data.map((item) => {
        const myItem = item;
        myItem.images = getArtistImageArrayFromObject(item)
        return myItem;
      });
      setRelatedData(myData);
      setRelatedLoading(false);
    }
  }, [relatedArtistQuery.data]);

  if (loading || relatedLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className={classes.root}>
      <Hero data={data} />
      <SectionAlternate>
        <Detail data={data} />
      </SectionAlternate>
      <Section>
        <Advantages data={data} />
      </Section>
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
      {data.rating !== null && data.Reviews.length > 0 && (
        <>
          <Divider />
          <Section>
            <Reviews data={data} reviews={reviews} />
          </Section>
        </>
      )}
      <Divider />
      { false && (
      <MapHero data={mapData} artist={data}/>
      )}
      <SectionAlternate>
        <RelatedArtists data={locations} artist={data} relatedArtists={relatedData}/>
      </SectionAlternate>
    </div>
  );
};

export default ArtistDetail;
