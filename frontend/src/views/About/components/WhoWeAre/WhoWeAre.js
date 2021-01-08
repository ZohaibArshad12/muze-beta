import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { loremIpsum } from 'react-lorem-ipsum';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const WhoWeAre = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} sm={6} data-aos="fade-up">
          <SectionHeader
            title="Who are we?"
            subtitle={loremIpsum({avgSentencesPerParagraph:4})}
            disableGutter
            align="left"
            subtitleProps={{
              variant: 'body1',
              style: {color: theme.palette.text.light},
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} data-aos="fade-up">
          <SectionHeader
            title="What’s up with the name?"
            subtitle={loremIpsum({avgSentencesPerParagraph:4})}
            disableGutter
            align="left"
            subtitleProps={{
              variant: 'body1',
              style: {color: theme.palette.text.light},
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

WhoWeAre.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default WhoWeAre;
