import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section } from 'components/organisms';
import { Hero } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    overflow: 'hidden'
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '99.8%',
  }

}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
    <video className={classes.video} autoPlay loop muted>
      <source src='/videos/homepage-video.mp4' type='video/mp4' />
    </video>
      <Section>
        <Hero />
      </Section>
      <Divider />
    </div>
  );
};

export default Home;
