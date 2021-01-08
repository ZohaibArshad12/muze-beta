import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBooker } from 'components/organisms';
import 'date-fns';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles(theme => ({
  root: {},
  typed: {
    fontWeight: 'bold',
  },
  listItemAvatar: {
    minWidth: 28,
  },
  formCover: {
    objectFit: 'cover',
    borderBottomLeftRadius: '40%',
  },
  cardBooker: {
    [theme.breakpoints.up('md')]: {
      maxWidth: 400,
    },
  },
}));

function nl2br(text) {
  return text.replace(/\n/g, '<br><br>');
}

const Detail = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={4}>
        <Grid
          item
          container
          justify="flex-start"
          alignItems="center"
          xs={12}
          md={6}
          data-aos="fade-up"
        >
          <CardBooker
            data={data}
            className={classes.cardBooker}
            withShadow
          />
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          justify="flex-end"
          xs={12}
          md={6}
          data-aos="fade-up"
        >
          <Grid item>
            <SectionHeader
              title={
                <>
                  <span>
                    About the Artist
                  </span>
                </>
              }
              subtitle={nl2br(data.description)}
              subtitleUnescaped={true}
              subtitleProps={{style: { color: theme.palette.text.light }}}
              align="left"
              disableGutter
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Detail.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to render
   */
  data: PropTypes.object.isRequired,
};

export default Detail;
