import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section } from 'components/organisms';
import { Hero } from './components';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '99vw',
    height: 'auto',
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <video className={classes.video} autoPlay loop muted>
        <source
          src="https://player.vimeo.com/external/500153843.hd.mp4?s=f3dcb73c184012a21738f19fda68c2ccc1eb7518&profile_id=175"
          type="video/mp4"
        />
      </video>
      <Section>
        <Hero />
      </Section>
      <Divider />
    </div>
  );
};

export default Home;
