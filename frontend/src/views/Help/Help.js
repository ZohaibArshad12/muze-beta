import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import { Breadcrumb, Contact, Questions } from './components';

import { breadcrumb, questions } from './data';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  sectionBreadcrumb: {
    '& .section-alternate__content': {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
}));

const Help = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SectionAlternate className={classes.sectionBreadcrumb}>
        <Breadcrumb data={breadcrumb} />
      </SectionAlternate>
      <Section className={classes.pagePaddingTop}>
        <Questions data={questions} />
      </Section>
      <SectionAlternate>
        <Contact />
      </SectionAlternate>
    </div>
  );
};

export default Help;
