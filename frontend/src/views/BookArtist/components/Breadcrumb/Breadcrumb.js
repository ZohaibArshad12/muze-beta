import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import { NavLink as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {},
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <RouterLink {...props} />
  </div>
));

const Breadcrumb = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Breadcrumbs aria-label="breadcrumb">
        {data.map((item, index) => (
          <span key={index}>
            {item.isActive ? (
              <Typography color="textPrimary">{item.title}</Typography>
            ) : (
              <Link color="textSecondary" component={CustomRouterLink} to={item.href}>{item.title}</Link>
            )}
          </span>
        ))}
      </Breadcrumbs>
    </div>
  );
};

Breadcrumb.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Breadcrumb;
