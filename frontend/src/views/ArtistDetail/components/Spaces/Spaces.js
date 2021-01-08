import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';
import { SectionHeader, OverlapedImages } from 'components/molecules';

const useStyles = makeStyles(() => ({
  root: {},
}));

const Spaces = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <SectionHeader
            label="SCALABLE"
            title={
              <span>
                <span className="text-highlighted">Flexible office space </span>
                means growing your team is easy.
              </span>
            }
            subtitle="Rather than worrying about switching offices every couple years, you can instead stay in the same location and grow-up from your shared coworking space to an office that takes up an entire floor."
            align="left"
            fadeUp
            disableGutter
          />
        </Grid>
        <Grid item xs={12} sm={6} data-aos="fade-up">
          <OverlapedImages
            image1={{
              src: '/images/photos/coworking/place1.jpg',
              srcSet: '/images/photos/coworking/place1@2x.jpg 2x',
              alt: '...',
            }}
            image2={{
              src: '/images/photos/coworking/place2.jpg',
              srcSet: '/images/photos/coworking/place2@2x.jpg 2x',
              alt: '...',
            }}
            image3={{
              src: '/images/photos/coworking/place3.jpg',
              srcSet: '/images/photos/coworking/place3@2x.jpg 2x',
              alt: '...',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Spaces.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Spaces;
