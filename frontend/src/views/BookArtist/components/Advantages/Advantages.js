import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Grid, colors } from '@material-ui/core';
import { Icon } from 'components/atoms';
import { DescriptionListIcon } from 'components/organisms';

const useStyles = makeStyles(() => ({
  root: {},
}));

const Advantages = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid key={index} item xs={12} md={3} data-aos="fade-up">
            <DescriptionListIcon
              title={item.title}
              subtitle={item.subtitle}
              icon={
                <Icon
                  fontIconClass={item.icon}
                  size="medium"
                  fontIconColor={colors.deepPurple[300]}
                />
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Advantages.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Advantages;
