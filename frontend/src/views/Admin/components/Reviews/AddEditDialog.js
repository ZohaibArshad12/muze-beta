import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField, Typography,
} from '@material-ui/core';
import { useAuth0 } from '../../../../hooks/useAuth0';
import { capitalize, isNumber } from '../../../../utils';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  textField: {
    width: 442,
    margin: theme.spacing(1, 1, 1, 0),
    '&.MuiFormControl-fullWidth': {
      width: 892,
    },
  },
  dropdown: {
    width: 442,
    margin: theme.spacing(1, 1, 1, 0),
    '&.MuiFormControl-fullWidth': {
      width: 892,
    },
  },
  picker: {
    width: 442,
    margin: theme.spacing(1, 1, 1, 0),
    '&.MuiFormControl-fullWidth': {
      width: 892,
    },
  },
  activeSwitch: {
    position: 'absolute',
    top: '10px',
    right: '60px',
  },
  videoFrame: {
    width: '892px !important',
    marginTop: theme.spacing(1),
    '& iframe': {
      borderRadius: theme.spacing(1),
    },
  },
}));

const customDialogTitleStyles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const CustomDialogTitle = withStyles(customDialogTitleStyles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const AddEditDialog = ({
                         open,
                         data,
                         mode,
                         endpoint,
                         handleClose,
                         handleRefresh,
                         lookups,
                         setWaitingState,
                       }) => {
  const classes = useStyles();
  const { getTokenSilently } = useAuth0();

  const [formValues, setFormValues] = useState({});
  const hasErrors = useRef(false);

  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    if (open === true) {
      if (!data.rating) {
        data.rating = 5;
      }
      if (data.active === '' || typeof data.active === 'undefined') {
        data.active = true;
      }
      hasErrors.current = false;
      setErrorMessages({});
      setFormValues(data);
    }

    setFormValues((prevState) => {
      let newValues = { ...prevState };
      newValues['artists'] = data.Artists;
      return newValues;
    });
  }, [open, data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrorMessages(prev => ({ ...prev, [name]: false }));
    setFormValues((prevState) => {
      let newValues = { ...prevState };
      newValues[name] = value;
      return newValues;
    });
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setErrorMessages(prev => ({ ...prev, [name]: false }));
    setFormValues((prevState) => {
      let newValues = { ...prevState };
      newValues[name] = checked;
      return newValues;
    });
  };

  const formIsValid = () => {
    hasErrors.current = false;
    setErrorMessages({});

    if (!formValues.artist_id) {
      addError('artist_id', 'Artist is required.');
    }
    if (!formValues.author_name) {
      addError('author_name', 'Name is required.');
    }
    if (!formValues.review) {
      addError('review', 'Review is required.');
    }
    if (!isNumber(formValues.rating)) {
      addError('rating', 'Rating must be a number.');
    }
    if (formValues.rating < 1 || formValues.rating > 5) {
      addError('rating', 'Rating must be between 1 and 5.');
    }

    return !hasErrors.current;
  };

  const addError = (key, message) => {
    hasErrors.current = true;
    setErrorMessages(prev => ({ ...prev, [key]: message }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formIsValid()) return;
    setWaitingState('in progress');
    try {
      const token = await getTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };
      const axiosMethod = mode === 'add' ? axios.post : axios.put;
      await axiosMethod(
        mode === 'add' ?
          `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}`
          : // mode === edit
          `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${data.id}`
        ,
        mode === 'add' ?
          {
            artist_id: formValues.artist_id.id,
            author_name: formValues.author_name,
            author_title: formValues.author_title,
            author_email: formValues.author_email,
            review: formValues.review,
            rating: formValues.rating,
            active: formValues.active,
          } : { // mode === edit
            id: formValues.id,
            author_name: formValues.author_name,
            author_title: formValues.author_title,
            author_email: formValues.author_email,
            review: formValues.review,
            rating: formValues.rating,
            active: formValues.active,
          },
        { headers },
      );
      handleRefresh();
      setWaitingState('complete', 'no error');
      handleClose();
    } catch (err) {
      console.error(err);
      setWaitingState('complete', 'error');
    }
  };

  const IOSSwitch = withStyles((theme) => ({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-form-title"
      maxWidth="md"
      style={{ height: '100%', postion: 'relative' }}
    >
      <CustomDialogTitle id="dialog-form-title" onClose={handleClose}>{capitalize(mode)} Review</CustomDialogTitle>

      <DialogContent>
        <form method="post" onSubmit={handleSubmit}>
          <Autocomplete
            id="artist"
            options={lookups.artists}
            getOptionLabel={option => typeof option === 'object' ? option.name : lookups.artists.find(x => x.id === option).name}
            getOptionSelected={(option, value) => option.id === value}
            value={formValues.artist_id}
            disableClearable={true}
            disabled={mode === 'edit'}
            onChange={(event, newValue) => {
              handleChange({ target: { name: 'artist_id', value: newValue } });
            }}
            renderInput={params => (
              <TextField
                {...params}
                error={!!errorMessages.artist_id}
                helperText={errorMessages.artist_id && errorMessages.artist_id}
                variant="outlined"
                label="Artist"
                size="medium"
                placeholder=""
                className={classes.textField}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  shrink: true,
                }}
              />
            )}
          />
          <TextField
            error={!!errorMessages.author_name}
            helperText={errorMessages.author_name && errorMessages.author_name}
            variant="outlined"
            className={classes.textField}
            name="author_name"
            label="Author Name"
            value={formValues.author_name || ''}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="author_title"
            label="Author Title"
            value={formValues.author_title || ''}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            className={classes.textField}
            name="author_email"
            label="Author Email (Internal Use Only)"
            value={formValues.author_email || ''}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            error={!!errorMessages.review}
            helperText={errorMessages.review && errorMessages.review}
            variant="outlined"
            className={classes.textField}
            name="review"
            label="Review"
            value={formValues.review || ''}
            multiline
            rows={4}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            error={!!errorMessages.rating}
            helperText={errorMessages.rating && errorMessages.rating}
            variant="outlined"
            className={classes.textField}
            name="rating"
            label="Rating (1 to 5)"
            value={formValues.rating || ''}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            disabled
            variant="outlined"
            className={classes.textField}
            name="created"
            label="Created"
            value={moment(formValues.created).format('MM/DD/yyyy h:mma') || ''}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControlLabel
            control={<IOSSwitch checked={formValues.active === true} onChange={handleSwitchChange} name="active" />}
            label="Active"
            className={classes.activeSwitch}
          />
          <Box mt={2} mb={2}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disableElevation
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              disableElevation
            >
              Cancel
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddEditDialog.propTypes = {
  /**
   * Handler responsible for closing dialog
   * window on submit or cancel.
   */
  handleClose: PropTypes.func.isRequired,
  /**
   * Handler responsible for triggering a data
   * reload in the parent component
   */
  handleRefresh: PropTypes.func.isRequired,
  /**
   * Boolean used to control if the dialog is
   * open or closed.
   */
  open: PropTypes.bool.isRequired,
};

export default AddEditDialog;
