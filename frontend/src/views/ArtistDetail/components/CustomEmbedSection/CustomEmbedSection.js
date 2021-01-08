import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const CustomEmbedSection = props => {
  const { code, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
};

CustomEmbedSection.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * code to be embedded
   */
  code: PropTypes.string.isRequired,
};

export default CustomEmbedSection;
