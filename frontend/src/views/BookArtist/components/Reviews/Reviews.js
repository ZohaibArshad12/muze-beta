import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useMediaQuery, Grid, colors } from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { CardReview } from 'components/organisms';
import { rating } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  root: {},
  sectionHeadlineStars: {
    maxWidth: 120,
  },
  ratingContainer: {
    margin: theme.spacing(2, 0, 0),
    fontSize: '24px'
  },
  ratingIcon: {
    color: colors.yellow[700],
    marginRight: theme.spacing(1 / 2),
  },
}));

const Reviews = props => {
  const { data, reviews, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <SectionHeader
        overline={
          <div className={classes.ratingContainer}>
            {rating(data.rating, classes.ratingIcon)}
          </div>
        }
        title={
            <span>Rated {data.rating} out of 5 stars</span>
        }
        subtitle={`Here's what other customers have to say about ${data.name}`}
        align="center"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {reviews.map((review, index) => (
          <Grid
            key={index}
            item
            container
            alignItems="center"
            direction="column"
            xs={12}
            md={4}
            data-aos="fade-up"
          >
            <CardReview
              variant="outlined"
              text={review.feedback}
              icon={
                <IconAlternate
                  color={colors.deepPurple}
                  fontIconClass="fas fa-quote-right"
                />
              }
              authorName={review.authorName}
              authorTitle={review.authorOccupation}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Reviews.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.object.isRequired,
};

export default Reviews;
