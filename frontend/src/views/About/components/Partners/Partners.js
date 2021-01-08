import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  root: {},
  promoLogo: {
    maxWidth: 120,
    // below filters generated with color #68518f @ https://codepen.io/sosuke/pen/Pjoqqp
    filter: "brightness(0) saturate(100%) invert(34%) sepia(11%) saturate(2688%) hue-rotate(220deg) brightness(87%) contrast(76%)",
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
  },
}));

const Partners = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={4}>
          <SectionHeader
            title="Creativity"
            fadeUp
            disableGutter
            align={'center'}
            titleProps={{
              className: classes.title,
              style:{ color: theme.palette.text.secondaryDark }
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SectionHeader
            title="Innovation"
            fadeUp
            disableGutter
            align={'center'}
            titleProps={{
              className: classes.title,
              style:{ color: theme.palette.text.secondaryDark }
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SectionHeader
            title="Transparency"
            fadeUp
            disableGutter
            align={'center'}
            titleProps={{
              className: classes.title,
              style:{ color: theme.palette.text.secondaryDark }
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Partners.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Partners;
