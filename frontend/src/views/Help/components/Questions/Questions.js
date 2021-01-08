import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  colors, Typography,
} from '@material-ui/core';
import { IconAlternate } from 'components/molecules';
import { Accordion } from 'components/organisms';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    fontWeight: 'bold',
  },
  accordionGrid: {
    '& .accordion__item-wrapper': {
      boxShadow: '0 1.5rem 4rem rgba(22,28,45,.05)',
    },
  },
  fontWeightBold: {
    fontWeight: 'bold',
  },
  fontWeight300: {
    fontWeight: 300,
  },
  listItemAvatar: {
    marginRight: theme.spacing(2),
  },
  listItemText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  answerCount: {
    padding: theme.spacing(1 / 2, 1),
    borderRadius: theme.spacing(1),
    background: theme.palette.secondary.light,
    color: 'white',
    fontWeight: 700,
  },
}));

const Questions = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <List className={classes.root}>
            <ListItem disableGutters>
              <ListItemAvatar className={classes.listItemAvatar}>
                <IconAlternate
                  fontIconClass={data.icon}
                  size="medium"
                  color={colors.deepPurple[300]}
                  shape="circle"
                />
              </ListItemAvatar>
              <ListItemText
                primary={data.title}
                secondary={data.subtitle}
                primaryTypographyProps={{
                  variant: 'h6',
                }}
                secondaryTypographyProps={{
                  variant: 'h6',
                }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                className={classes.listItemText}
                primary=""
                secondary={`${data.items.length} answers`}
                primaryTypographyProps={{
                  variant: 'subtitle1',
                  color: 'textSecondary',
                }}
                secondaryTypographyProps={{
                  variant: 'body1',
                  className: classes.answerCount,
                }}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} className={classes.accordionGrid}>
          <Accordion
            items={data.items}
            titleProps={{
              variant: 'subtitle1',
              className: classes.fontWeightBold,
            }}
            subtitleProps={{
              className: classes.fontWeight300,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" style={{marginTop: theme.spacing(6)}}>
            Thank you for being apart of the Muze Music Beta platform. Please be a
            aware that errors may occur during the user experience. Please do not
            hesitate to call us at 925-658-2751 or 1-617-842-4669 and email us at
            info@muzebeta.com in regards to any questions, comments, or concerns. We are
            here to listen to our audience and understand what we can do to be better.
            We have hand selected and vetted 100 musicians to be on the platform, to
            mitigate issues that may occur.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

Questions.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.object.isRequired,
};

export default Questions;
