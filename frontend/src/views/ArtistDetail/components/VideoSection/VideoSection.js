import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  videoIframe: {
    boxShadow: '0 5px 12px 0 rgba(30,76,165,.2)',
    borderRadius: theme.spacing(1),
  },
  listGrid: {
    overflow: 'hidden',
  },
  partnerImage: {
    maxWidth: 120,
  },
}));

const VideoSection = props => {
  const { videoSrc, className, ...rest } = props;
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
        className={classes.listGrid}
      >
        <Grid item xs={12} data-aos={'fade-up'}>
          <Grid container justify="center">
            <iframe
              className={classes.videoIframe}
              title="video"
              width="100%"
              height="600"
              src={videoSrc}
              frameBorder="0"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

VideoSection.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  videoSrc: PropTypes.string.isRequired,
};

export default VideoSection;
