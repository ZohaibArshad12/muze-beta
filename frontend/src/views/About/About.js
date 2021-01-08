import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Contact,
  Hero,
  Partners,
  Story,
} from './components';

import { mapData } from './data';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black'
  },
  sectionNoPaddingTop: {
    paddingTop: 0,
  },
  sectionTeam: {
    background: theme.palette.primary.main
  },
  sectionPartners: {
    boxShadow: '0 5px 20px 0 rgba(90, 202, 157, 0.05)',
    backgroundColor: theme.palette.text.secondary,
    '& .section-alternate__content': {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
    },
  },
}));

const About = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Hero />
      <Section>
        <Story />
      </Section>
      <SectionAlternate className={classes.sectionPartners}>
        <Partners />
      </SectionAlternate>
      <Contact data={mapData} />
    </div>
  );
};

export default About;
