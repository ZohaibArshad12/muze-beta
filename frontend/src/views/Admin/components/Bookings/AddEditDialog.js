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
import { capitalize } from '../../../../utils';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

  const formIsValid = () => {
    hasErrors.current = false;
    setErrorMessages({});

    if (!formValues.artist_id) {
      addError('artist_id', 'Artist is required.');
    }
    if (!formValues.name) {
      addError('name', 'Name is required.');
    }
    if (!formValues.zoom_meeting_identifier) {
      addError('name', 'Zoom Meeting ID is required.');
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
            name: formValues.name,
            contact_firstname: formValues.contact_firstname,
            contact_lastname: formValues.contact_lastname,
            contact_email: formValues.contact_email,
            contact_address1: formValues.contact_address1,
            contact_address2: formValues.contact_address2,
            contact_city: formValues.contact_city,
            contact_state: formValues.contact_state,
            contact_zipcode: formValues.contact_zipcode,
            duration: formValues.duration,
            event_style: formValues.event_style,
            event_song_requests: formValues.event_song_requests,
            event_special_requests: formValues.event_special_requests,
            card_last4: formValues.card_last4,
            card_brand: formValues.card_brand,
            card_receipt_url: formValues.card_receipt_url,
            fee_duration: formValues.fee_duration,
            fee_service: formValues.fee_service,
            fee_total: formValues.fee_total,
            confirmation_code: formValues.confirmation_code,
            zoom_meeting_identifier: formValues.zoom_meeting_identifier,
            zoom_meeting_passcode: formValues.zoom_meeting_passcode,
            start_time: formValues.start_time,
            end_time: formValues.end_time,
          } : { // mode === edit
            id: formValues.id,
            artist_id: formValues.artist_id.id,
            name: formValues.name,
            contact_firstname: formValues.contact_firstname,
            contact_lastname: formValues.contact_lastname,
            contact_email: formValues.contact_email,
            contact_address1: formValues.contact_address1,
            contact_address2: formValues.contact_address2,
            contact_city: formValues.contact_city,
            contact_state: formValues.contact_state,
            contact_zipcode: formValues.contact_zipcode,
            duration: formValues.duration,
            event_style: formValues.event_style,
            event_song_requests: formValues.event_song_requests,
            event_special_requests: formValues.event_special_requests,
            card_last4: formValues.card_last4,
            card_brand: formValues.card_brand,
            card_receipt_url: formValues.card_receipt_url,
            fee_duration: formValues.fee_duration,
            fee_service: formValues.fee_service,
            fee_total: formValues.fee_total,
            confirmation_code: formValues.confirmation_code,
            zoom_meeting_identifier: formValues.zoom_meeting_identifier,
            zoom_meeting_passcode: formValues.zoom_meeting_passcode,
            start_time: formValues.start_time,
            end_time: formValues.end_time,
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-form-title"
      maxWidth="md"
      style={{ height: '100%', postion: 'relative' }}
    >
      <CustomDialogTitle id="dialog-form-title" onClose={handleClose}>{capitalize(mode)} Booking</CustomDialogTitle>

      <DialogContent>
        <form method="post" onSubmit={handleSubmit}>
          <Autocomplete
            id="artist"
            options={lookups.artists}
            getOptionLabel={option => typeof option === 'object' ? option.name : lookups.artists.find(x => x.id === option).name}
            getOptionSelected={(option, value) => option.id === value}
            value={formValues.artist_id || null}
            disableClearable={true}
            disabled={mode === 'edit' || mode === 'view'}
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
            fullWidth
            error={!!errorMessages.name}
            helperText={errorMessages.name && errorMessages.name}
            variant="outlined"
            className={classes.textField}
            name="name"
            label="Name (Internal Use Only)"
            value={formValues.name || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="contact_firstname"
            label="Contact First Name"
            value={formValues.contact_firstname || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="contact_lastname"
            label="Contact Last Name"
            value={formValues.contact_lastname || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            className={classes.textField}
            name="contact_email"
            label="Contact Email"
            value={formValues.contact_email || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            variant="outlined"
            className={classes.textField}
            name="contact_address1"
            label="Contact Address 1"
            value={formValues.contact_address1 || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="contact_address2"
            label="Contact Address 2"
            value={formValues.contact_address2 || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="contact_city"
            label="Contact City"
            value={formValues.contact_city || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="contact_state"
            label="Contact State"
            value={formValues.contact_state || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="contact_zipcode"
            label="Contact Zip Code"
            value={formValues.contact_zipcode || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="duration"
            label="Duration (in minutes)"
            value={formValues.duration || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="start_time"
            label="Event Date"
            value={moment(formValues.start_time).add(moment().utcOffset(), 'minutes').format('dddd, MMMM Do, YYYY')}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="end_time"
            label="Event Time"
            value={moment(formValues.start_time).add(moment().utcOffset(), 'minutes').format('LT') + ' -  ' + moment(formValues.end_time).add(moment().utcOffset(), 'minutes').format('LT')}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            className={classes.textField}
            name="event_style"
            label="Event Style"
            value={formValues.event_style || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            className={classes.textField}
            name="event_song_requests"
            label="Song Requests"
            value={formValues.event_song_requests || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            className={classes.textField}
            name="event_special_requests"
            label="Special Requests"
            value={formValues.event_special_requests || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="card_last4"
            label="Card Last4"
            value={formValues.card_last4 || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="card_brand"
            label="Card Brand"
            value={formValues.card_brand || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            className={classes.textField}
            name="card_receipt_url"
            label="Card Receipt URL"
            value={formValues.card_receipt_url || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="fee_duration"
            label="Duration Fee"
            value={formValues.fee_duration || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="fee_service"
            label="Service Fee"
            value={formValues.fee_service || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="fee_total"
            label="Total Fee"
            value={formValues.fee_total || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="confirmation_code"
            label="Confirmation Code"
            value={formValues.confirmation_code || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            error={!!errorMessages.zoom_meeting_identifier}
            helperText={errorMessages.zoom_meeting_identifier && errorMessages.zoom_meeting_identifier}
            variant="outlined"
            className={classes.textField}
            name="zoom_meeting_identifier"
            label="Zoom Meeting ID"
            value={formValues.zoom_meeting_identifier || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            className={classes.textField}
            name="zoom_meeting_passcode"
            label="Zoom Meeting Passcode"
            value={formValues.zoom_meeting_passcode || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            disabled
            variant="outlined"
            className={classes.textField}
            name="id"
            label="Database ID (Internal Use Only)"
            value={formValues.id || ''}
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
            value={moment(formValues.created).add(moment().utcOffset(), 'minutes').format('MM/DD/yyyy h:mma') || ''}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box mt={2} mb={2}>
            {mode === 'view' && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleClose}
                disableElevation
              >
                Close
              </Button>
            )}
            {mode !== 'view' && (
              <>
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
              </>
            )}
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
