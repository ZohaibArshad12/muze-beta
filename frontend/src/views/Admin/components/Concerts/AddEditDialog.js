import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Box, Dialog, DialogTitle, DialogContent, TextField, Typography } from '@material-ui/core';
import { useAuth0 } from '../../../../hooks/useAuth0';
import { capitalize, isNumber } from '../../../../utils';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import withStyles from '@material-ui/core/styles/withStyles';
import YouTube from 'react-youtube-embed';
import AddEditDialogTabs from './AddEditDialogTabs';

import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { Image } from '../../../../components/atoms';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ClearIcon from '@material-ui/icons/Clear';
import 'date-fns';

const useStyles = makeStyles(theme => ({
  form: {},
  autocomplete: {
    width: 450,
    margin: 0,
    display: 'inline-flex',
  },
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
    marginBottom: theme.spacing(1),
    '& iframe': {
      borderRadius: theme.spacing(1),
    },
  },
  uploadInput: {
    width: 442,
  },
  uploadBtn: {
    marginBottom: theme.spacing(1),
    width: 442,
    height: 56,
  },
  uploadPreview: {
    borderRadius: '4px',
    border: '1px solid #424242',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    position: 'relative',
    minHeight: 120,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      margin: 0,
      padding: 0,
      maxWidth: 426,
    },
  },
  uploadClearBtn: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  imgDivider: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const customDialogTitleStyles = theme => ({
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

const CustomDialogTitle = withStyles(customDialogTitleStyles)(props => {
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

const AddEditDialog = ({ open, data, mode, endpoint, handleClose, handleRefresh, setWaitingState }) => {
  const classes = useStyles();
  const { getTokenSilently } = useAuth0();
  const theme = useTheme();

  const [formValues, setFormValues] = useState({});
  const hasErrors = useRef(false);

  const [errorMessages, setErrorMessages] = useState({});
  const [tabNum, setTabNum] = useState(0);

  useEffect(() => {
    setTabNum(0);
  }, [open]);

  useEffect(() => {
    if (open === true) {
      if (data.active === '' || typeof data.active === 'undefined') {
        data.active = true;
      }
      hasErrors.current = false;
      setErrorMessages({});
      setFormValues(data);
    }
  }, [open, data]);

  const handleChange = event => {
    const { name, value } = event.target;
    setErrorMessages(prev => ({ ...prev, [name]: false }));
    setFormValues(prevState => {
      let newValues = { ...prevState };
      newValues[name] = value;
      return newValues;
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabNum(newValue);
  };

  const formIsValid = () => {
    hasErrors.current = false;
    setErrorMessages({});

    if (!formValues.name) {
      addError('name', 'Name is required.');
    }
    if (!formValues.rate) {
      addError('rate', 'Rate must be greater than zero.');
    }
    if (!isNumber(formValues.rate)) {
      addError('rate', 'Rate must be a number.');
    }
    if (!formValues.concert_time) {
      addError('concert_time', 'Concert Time is required.');
    }
    if (!formValues.on_zoom_url) {
      addError('on_zoom_url', 'On Zoom URL is required.');
    }

    if (formValues.video_url?.length > 0 && formValues.video_url.length !== 11) {
      function getId(str) {
        str = str.split('/');
        str = str.pop();
        if (str.indexOf('?v=') > -1) {
          str = str.split('?v=')[1];
        }
        str = str.split('?')[0];
        str = str.split('&')[0];
        return str;
      }

      formValues.video_url = getId(formValues.video_url);

      setFormValues(prevState => {
        let newValues = { ...prevState };
        newValues['video_url'] = getId(formValues.video_url);
        return newValues;
      });

      if (getId(formValues.video_url).length !== 11) {
        addError('video_url', 'Please enter only the 11-character video ID.');
      }
    }

    return !hasErrors.current;
  };

  const addError = (key, message) => {
    hasErrors.current = true;
    setErrorMessages(prev => ({ ...prev, [key]: message }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!formIsValid()) return;
    setWaitingState('in progress');
    try {
      const token = await getTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };
      const axiosMethod = mode === 'add' ? axios.post : axios.put;
      const body = {
        name: formValues.name,
        email: formValues.email,
        short_description: formValues.short_description,
        description: formValues.description,
        rate: formValues.rate,
        active: formValues.active,
        concert_time: formValues.concert_time,
        on_zoom_url: formValues.on_zoom_url,
        cover_img_url: formValues.cover_img_url,
        image1_url: formValues.image1_url,
        image2_url: formValues.image2_url,
        image3_url: formValues.image3_url,
        image4_url: formValues.image4_url,
        video_url: formValues.video_url,
        custom_embed: formValues.custom_embed,
      };
      await axiosMethod(
        mode === 'add'
          ? `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}`
          : // mode === edit
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${data.id}`,
        mode === 'add'
          ? body
          : {
              // mode === edit
              id: formValues.id,
              ...body,
            },
        { headers }
      );
      handleRefresh();
      setWaitingState('complete', 'no error');
      handleClose();
    } catch (err) {
      console.error(err);
      setWaitingState('complete', 'error');
    }
  };

  const IOSSwitch = withStyles(theme => ({
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

  const ImageUpload = ({ name, label }) => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <TextField
            error={!!errorMessages[name]}
            helperText={errorMessages[name] && errorMessages[name]}
            variant="outlined"
            className={clsx(classes.textField, classes.uploadInput)}
            name={name}
            label={label}
            value={formValues[name] || ''}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button className={classes.uploadBtn} onClick={() => openWidget(name)} size="large" variant="contained">
            Upload {label}
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.uploadPreview}>
            {formValues[name] && (
              <>
                <IconButton aria-label="close" className={classes.uploadClearBtn} onClick={() => onClearUpload(name)}>
                  <CloseIcon />
                </IconButton>
                <Image lazy={false} src={formValues[name]} alt="Image Preview" />
              </>
            )}
            {!formValues[name] && <Typography variant="caption">{label} preview unavailable.</Typography>}
          </div>
        </Grid>
      </Grid>
    );
  };

  const openWidget = name => {
    // create the widget
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'db3nixwdi',
        uploadPreset: 'pmzxpbeh',
        format: 'json',
        type: 'list',
        version: Math.ceil(new Date().getTime() / 1000),
      },
      (error, result) => {
        if (result.event === 'success') {
          setFormValues(prevState => {
            let newValues = { ...prevState };
            newValues[name] = result.info.secure_url;
            return newValues;
          });
        }
      }
    );
  };

  const onClearUpload = key => {
    setFormValues(prevState => {
      let newValues = { ...prevState };
      newValues[key] = null;
      return newValues;
    });
  };

  const handleSwitchChange = event => {
    const { name, checked } = event.target;
    setErrorMessages(prev => ({ ...prev, [name]: false }));
    setFormValues(prevState => {
      let newValues = { ...prevState };
      newValues[name] = checked;
      return newValues;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-form-title"
      maxWidth="md"
      style={{ height: '100%', postion: 'relative' }}
    >
      <CustomDialogTitle id="dialog-form-title" onClose={handleClose}>
        {capitalize(mode)} Concert
      </CustomDialogTitle>

      <DialogContent>
        <AddEditDialogTabs mode={mode} style={{ marginBottom: theme.spacing(2) }} onChange={handleTabChange} />
        <>
          <form method="post" onSubmit={handleSubmit} className={classes.form}>
            {tabNum === 0 && (
              <>
                <TextField
                  fullWidth
                  error={!!errorMessages.name}
                  helperText={errorMessages.name && errorMessages.name}
                  variant="outlined"
                  className={classes.textField}
                  name="name"
                  label="Title"
                  value={formValues.name || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  className={classes.textField}
                  name="email"
                  label="Email"
                  value={formValues.email || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  className={classes.textField}
                  name="short_description"
                  label="Short Description"
                  value={formValues.short_description || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  className={classes.textField}
                  name="description"
                  label="Description"
                  value={formValues.description || ''}
                  multiline
                  rows={6}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Grid item md={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      error={!!errorMessages.concert_time}
                      helperText={errorMessages.concert_time}
                      autoOk
                      disablePast
                      minutesStep={5}
                      variant="inline"
                      inputVariant="outlined"
                      format="MM/dd/yyyy h:mma"
                      margin="normal"
                      id="date"
                      label="Date"
                      name="concert_time"
                      className={clsx(classes.datePicker, classes.textField)}
                      value={ formValues.concert_time ? moment(formValues.concert_time).add(moment().utcOffset(), 'minutes').format('YYYY-MM-DDTHH:mm:ss') : null}
                      onChange={value => {
                        setFormValues(prevState => {
                          let newValues = { ...prevState };
                          newValues.concert_time = value;
                          return newValues;
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <i className={clsx('fas fa-calendar', classes.searchIcon)} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <IconButton
                            edge="end"
                            size="small"
                            className={!formValues.concert_time ? 'pickerNoDate' : 'pickerHasDate'}
                            style={{ visibility: !formValues.concert_time ? 'hidden' : 'visible' }}
                            onClick={event => {
                              event.preventDefault();
                              event.stopPropagation();
                              setFormValues(prevState => {
                                let newValues = { ...prevState };
                                newValues.concert_time = null;
                                return newValues;
                              });
                            }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        ),
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <TextField
                  error={!!errorMessages.rate}
                  helperText={errorMessages.rate && errorMessages.rate}
                  variant="outlined"
                  className={classes.textField}
                  name="rate"
                  label="Rate / 10 mins"
                  value={formValues.rate || ''}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span style={{ color: theme.palette.text.light }}>$</span>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  className={classes.textField}
                  name="video_url"
                  label="Embedded Video ID"
                  value={formValues.video_url || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {formValues.video_url && <YouTube id={formValues.video_url} className={classes.videoFrame} />}
                <TextField
                  fullWidth
                  error={!!errorMessages.on_zoom_url}
                  helperText={errorMessages.on_zoom_url}
                  variant="outlined"
                  className={classes.textField}
                  name="on_zoom_url"
                  label="OnZoom URL"
                  value={formValues.on_zoom_url || ''}
                  multiline
                  rows={6}
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
                  value={
                    moment(formValues.created)
                      .add(moment().utcOffset(), 'minutes')
                      .format('MM/DD/yyyy h:mma') || ''
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControlLabel
                  control={
                    <IOSSwitch checked={formValues.active === true} onChange={handleSwitchChange} name="active" />
                  }
                  label="Active"
                  className={classes.activeSwitch}
                />
              </>
            )}
            {tabNum === 1 && (
              <>
                <ImageUpload name="cover_img_url" label="Cover Image" />
                <Divider className={classes.imgDivider} />
                <ImageUpload name="image1_url" label="Image #1" />
                <Divider className={classes.imgDivider} />
                <ImageUpload name="image2_url" label="Image #2" />
                <Divider className={classes.imgDivider} />
                <ImageUpload name="image3_url" label="Image #3" />
                <Divider className={classes.imgDivider} />
                <ImageUpload name="image4_url" label="Image #4" />
                <Divider className={classes.imgDivider} />
              </>
            )}
            {tabNum <= 1 && (
              <Box mt={2} mb={2}>
                <Button type="submit" variant="contained" color="secondary" disableElevation style={{ marginRight: 8 }}>
                  Save
                </Button>
                <Button type="button" variant="outlined" onClick={handleClose} disableElevation>
                  Cancel
                </Button>
              </Box>
            )}
          </form>
        </>
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
