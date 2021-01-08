import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  TextField,
  Button,
  colors,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { Icon } from 'components/atoms';
import { useApp } from '../../../../AppProvider';
import validate from 'validate.js';

const useStyles = makeStyles(theme => ({
  root: {},
  list: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  listItemText: {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  },
  listItem: {
    justifyContent: 'flex-start',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
    },
  },
  icon: {
    background: 'transparent',
    borderRadius: 0,
  },
  form: {
    maxWidth: 550,
    margin: `0 auto`,
    marginTop: theme.spacing(5),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(10),
    },

  },
  inputTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  // textField: {
  //   width: '100%',
  //   '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
  //     borderColor: theme.palette.textField.borderMain,
  //   },
  //   '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
  //     borderColor: theme.palette.textField.borderHover,
  //   },
  //   '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //     borderColor: theme.palette.textField.borderFocus,
  //   },
  //   '& .MuiOutlinedInput-input': {
  //     color: theme.palette.textField.textMain,
  //   },
  //   '&:hover .MuiOutlinedInput-input': {
  //     color: theme.palette.textField.textHover,
  //   },
  //   '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
  //     color: theme.palette.textField.textFocus,
  //   },
  //   '& .MuiInputLabel-outlined': {
  //     color: theme.palette.textField.labelMain,
  //   },
  //   '&:hover .MuiInputLabel-outlined': {
  //     color: theme.palette.textField.labelHover,
  //   },
  //   '& .MuiInputLabel-outlined.Mui-focused': {
  //     color: theme.palette.textField.labelFocus,
  //   },
  // },
}));

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128,
    },
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 300,
    },
  },
  message: {
    presence: { allowEmpty: false, message: 'is required' },
  },
};

const defaultFormState = {
  isValid: false,
  values: {
    name: '',
    email: '',
    message: '',
  },
  touched: {},
  errors: {},
};

const Contact = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const app = useApp();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));

  };

  const handleSubmit = () => {
    setFormSubmitted(true);
    setFormSuccess(false);

    const errors = validate(formState.values, schema);

    if (!errors) {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState.values),
    });

    response.json().then((result) => {
      setFormSuccess(true);
      setFormSubmitted(false);
      setFormState(defaultFormState);
    });
  }
  const hasError = field =>
    (formSubmitted || formState.touched[field]) && formState.errors[field]
      ? true : false;

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <SectionHeader
        title="Can't find the answer you need?"
        subtitle="We're happy to help! Please fill out the following form describing your question and we will contact you with an answer as soon as possible. "
        subtitleProps={{
          variant: 'body1',
          color: 'textPrimary',
        }}
        data-aos="fade-up"
        align={isMd ? 'center' : 'left'}
      />
      <List disablePadding className={classes.list}>
        <ListItem
          disableGutters
          data-aos="fade-up"
          className={classes.listItem}
        >
          <ListItemAvatar className={classes.listItemAvatar}>
            <Icon fontIconClass="fa fa-phone" size="medium" fontIconColor={colors.deepPurple[300]}
                  className={classes.icon} />
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
              component: 'span',
            }}
          />
        </ListItem>
        <ListItem
          disableGutters
          data-aos="fade-up"
          className={classes.listItem}
        >
          <ListItemAvatar className={classes.listItemAvatar}>
            <Icon fontIconClass="fa fa-envelope" size="medium" fontIconColor={colors.deepPurple[300]}
                  className={classes.icon} />
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
        <ListItem
          disableGutters
          data-aos="fade-up"
          className={classes.listItem}
        >
          <ListItemAvatar className={classes.listItemAvatar}>
            <Icon fontIconClass="fa fa-map-marker-alt" size="medium" fontIconColor={colors.deepPurple[300]}
                  className={classes.icon} />
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
      <div className={classes.form}>
        <Grid container spacing={isMd ? 4 : 2}>
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Full name
            </Typography>
            <TextField
              helperText={hasError('name') ? formState.errors.name[0] : null}
              error={hasError('name')}
              placeholder="Your full name"
              variant="outlined"
              size="medium"
              name="name"
              fullWidth
              type="text"
              className={classes.textField}
              value={formState.values.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              E-mail
            </Typography>
            <TextField
              helperText={hasError('email') ? formState.errors.email[0] : null}
              error={hasError('email')}
              placeholder="Your e-mail address"
              variant="outlined"
              size="medium"
              name="email"
              fullWidth
              type="email"
              className={classes.textField}
              value={formState.values.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} data-aos="fade-up">
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Message
            </Typography>
            <TextField
              helperText={hasError('message') ? formState.errors.message[0] : null}
              error={hasError('message')}
              placeholder="Your question"
              variant="outlined"
              name="message"
              fullWidth
              multiline
              rows={4}
              className={classes.textField}
              value={formState.values.message}
              onChange={handleChange}
            />
          </Grid>
          {formSubmitted && !formState.isValid && (
            <Grid item xs={12} data-aos="fade-up">
              <Typography
                variant="subtitle1"
                color="error"
                className={classes.inputTitle}
              >
                Please correct the errors above.
              </Typography>
            </Grid>
          )}
          {(formSuccess) && (
            <Grid item xs={12} data-aos="fade-up">
              <Typography
                variant="subtitle1"
                color="textSecondary"
                align="center"
                className={classes.inputTitle}
              >
                Thank you for your message! We will contact you as soon as possible.
              </Typography>
            </Grid>
          )}
          <Grid item container justify="center" xs={12}>
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              size="large"
              onClick={handleSubmit}
            >
              submit
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Contact.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Contact;
