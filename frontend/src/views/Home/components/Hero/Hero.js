import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { SectionHeader, TypedText } from 'components/molecules';
import ArtistSearchBar from '../../../../components/organisms/ArtistSearchBar';

const useStyles = makeStyles(theme => ({
  root: {},
  typed: {
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest} data-aos={'fade-up'}>
      <SectionHeader
        title={
          <>
            Book live music performances
            <br />
            over Zoom for your
            <br />
            <TypedText
              component="span"
              variant="h2"
              color="secondary"
              className={classes.typed}
              typedProps={{
                strings: [
                  'corporate meeting',
                  'wedding',
                  'private event',
                  'restaurant',
                  'night club',
                ],
                typeSpeed: 50,
                loop: true,
              }}
            />
          </>
        }
        subtitle="MUZE enables you to entertain and impress your guests with live music performances."
        align="center"
        titleProps={{
          variant: 'h2',
          color: 'textPrimary',
        }}
        subtitleProps={{
          color: 'textPrimary',
          variant: 'h5',
        }}
        disableGutter
      />
      <ArtistSearchBar withShadow noBorder thinner transparentBg />
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Hero;
