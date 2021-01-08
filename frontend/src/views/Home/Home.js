import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section } from 'components/organisms';
import { Hero } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('/images/photos/home/hero-bg2.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top'
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Section>
        <Hero />
      </Section>
      <Divider />
    </div>
  );
};

export default Home;
