import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {},
  image: {
    maxWidth: 420,
  },
}));

const Story = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid
        container
        justify="space-between"
        spacing={isMd ? 4 : 2}
        direction={isMd ? 'row' : 'column-reverse'}
      >
        <Grid
          item
          container
          alignItems="center"
          justify="flex-start"
          xs={12}
          data-aos={'fade-up'}
        >
          <div>
            <SectionHeader
              title="Our story"
              subtitle={
                <>
                  <Typography variant="body1" paragraph>Muze sees the Music Industry cater to the 1%. For the other 99%
                    of Musicians and Artists, the talent is endless. By creating a seamless, efficient platform for
                    individuals to book live Musicians and Artists through Zoom, we are giving musicians the lead to get
                    themselves booked for gigs effectively.</Typography>
                  <Typography variant="body1" paragraph>We want to change the culture of having live entertainment, by
                    creating a new wave of entertainment
                    that allows musicians to showcase their musicianship, and creating an accessible, cost effective
                    platform for individuals to book anytime, anywhere. Muze Music is a platform for bookers to hire
                    musicians to get hired in a secure, efficient and cost-effective manner, focusing on quality of
                    musicianship, efficiency, and accessibility for all.</Typography>
                  <Typography variant="body1" paragraph>Find your Music, with us, at Muze Music.</Typography>
                </>
              }
              align="left"
              disableGutter
              subtitleProps={{
                style: { color: theme.palette.text.light },
                variant: 'body1',
              }}
            />
          </div>
        </Grid>

      </Grid>
    </div>
  );
};

Story.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Story;
