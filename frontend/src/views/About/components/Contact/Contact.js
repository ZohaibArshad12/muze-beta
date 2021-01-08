import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  colors,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { HeroShaped, Map } from 'components/organisms';
import { Icon } from '../../../../components/atoms';
import { useApp } from '../../../../AppProvider';

const useStyles = makeStyles(() => ({
  root: {},
  map: {
    zIndex: 9,
  },
  icon: {
    background: 'transparent',
    borderRadius: 0,
  },
}));

const Contact = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  const app = useApp();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <HeroShaped
        leftSide={
          <div>
            <SectionHeader
              title="Contact us"
              subtitleProps={{
                variant: 'body1',
                color: 'textPrimary',
              }}
              data-aos="fade-up"
              align="left"
            />
            <List disablePadding>
              <ListItem disableGutters data-aos="fade-up">
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Icon fontIconClass="fa fa-phone" size="medium" fontIconColor={colors.deepPurple[300]} className={classes.icon} />
                </ListItemAvatar>
                <ListItemText
                  className={classes.listItemText}
                  primary="Phone"
                  secondary={app.settings.phone}
                  primaryTypographyProps={{
                    className: classes.title,
                    variant: 'subtitle1',
                    color: 'textSecondary',
                  }}
                  secondaryTypographyProps={{
                    variant: 'subtitle1',
                    color: 'textPrimary',
                  }}
                />
              </ListItem>
              <ListItem disableGutters data-aos="fade-up">
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Icon fontIconClass="fa fa-envelope" size="medium" fontIconColor={colors.deepPurple[300]} className={classes.icon} />
                </ListItemAvatar>
                <ListItemText
                  className={classes.listItemText}
                  primary="Email"
                  secondary={app.settings.email}
                  primaryTypographyProps={{
                    className: classes.title,
                    variant: 'subtitle1',
                    color: 'textSecondary',
                  }}
                  secondaryTypographyProps={{
                    variant: 'subtitle1',
                    color: 'textPrimary',
                  }}
                />
              </ListItem>
              <ListItem disableGutters data-aos="fade-up">
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Icon fontIconClass="fa fa-map-marker-alt" size="medium" fontIconColor={colors.deepPurple[300]} className={classes.icon} />
                </ListItemAvatar>
                <ListItemText
                  className={classes.listItemText}
                  primary="Head Office"
                  secondary={app.settings.full_address}
                  primaryTypographyProps={{
                    className: classes.title,
                    variant: 'subtitle1',
                    color: 'textSecondary',
                  }}
                  secondaryTypographyProps={{
                    variant: 'subtitle1',
                    color: 'textPrimary',
                  }}
                />
              </ListItem>
            </List>
          </div>
        }
        rightSide={
          <Map
            center={[42.376231, -71.059622]}
            pins={data}
            className={classes.map}
            zoom={12}
          />
        }
      />
    </div>
  );
};

Contact.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Contact;
