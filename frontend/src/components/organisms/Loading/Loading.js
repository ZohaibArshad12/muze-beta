import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 99,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1)
  },
  svg: {
    // below filters generated with color #68518f @ https://codepen.io/sosuke/pen/Pjoqqp
    filter: 'brightness(0) saturate(100%) invert(34%) sepia(11%) saturate(2688%) hue-rotate(220deg) brightness(87%) contrast(76%)',
  },
  faded: {
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  top: {
    justifyContent: 'center',
    alignItems: 'start',
    paddingTop: theme.spacing(4),
    minHeight: 160
  },
}));

const Loading = ({ position = 'center', faded = false }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, classes[position], faded ? classes.faded : '')}>
      <img src="/images/illustrations/loading.svg" className={classes.svg} alt="loading" />
    </div>
  );
};

Loading.propTypes = {
  position: PropTypes.oneOf(['center', 'top']),
  faded: PropTypes.bool,
};

export default Loading;