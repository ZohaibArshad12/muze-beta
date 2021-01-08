import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import withStyles from '@material-ui/core/styles/withStyles';
import YouTube from 'react-youtube-embed';
import AddEditDialogTabs from './AddEditDialogTabs';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { Image } from '../../../../components/atoms';

const useStyles = makeStyles((theme) => ({
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
  }
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
      if (!data.artist_type_id) {
        data.artist_type_id = 1;
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
      newValues['artistGenres'] = data.ArtistGenres;
      return newValues;
    });

    setFormValues((prevState) => {
      let newValues = { ...prevState };
      newValues['locations'] = data.Locations;
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

  const handleTabChange = (event, newValue) => {
    setTabNum(newValue);
  };

  const formIsValid = () => {
    hasErrors.current = false;
    setErrorMessages({});

    if (!formValues.artist_type_id) {
      addError('artist_type_id', 'Artist type is required.');
    }
    if (!formValues.name) {
      addError('name', 'Name is required.');
    }
    if (!formValues.rate) {
      addError('rate', 'Rate must be greater than zero.');
    }
    if (!isNumber(formValues.rate)) {
      addError('rate', 'Rate must be a number.');
    }
    if (formValues.video_url.length > 0 && formValues.video_url.length !== 11) {
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

      setFormValues((prevState) => {
        let newValues = { ...prevState };
        newValues['video_url'] = getId(formValues.video_url);
        return newValues;
      })

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
            name: formValues.name,
            email: formValues.email,
            short_description: formValues.short_description,
            description: formValues.description,
            rate: formValues.rate,
            rating: formValues.rating,
            active: formValues.active,
            artist_type_id: formValues.artist_type_id.id,
            cover_img_url: formValues.cover_img_url,
            image1_url: formValues.image1_url,
            image2_url: formValues.image2_url,
            image3_url: formValues.image3_url,
            image4_url: formValues.image4_url,
            video_url: formValues.video_url,
            custom_embed: formValues.custom_embed,
            availability: formValues.availability,
            instruments: formValues.instruments,
            equipment: formValues.equipment,
            space: formValues.space,
            dress_code: formValues.dress_code,
            artistGenres: formValues.artistGenres,
            locations: formValues.locations,
          } : { // mode === edit
            id: formValues.id,
            name: formValues.name,
            email: formValues.email,
            short_description: formValues.short_description,
            description: formValues.description,
            rate: formValues.rate,
            rating: formValues.rating,
            active: formValues.active,
            artist_type_id: formValues.artist_type_id.id,
            cover_img_url: formValues.cover_img_url,
            image1_url: formValues.image1_url,
            image2_url: formValues.image2_url,
            image3_url: formValues.image3_url,
            image4_url: formValues.image4_url,
            video_url: formValues.video_url,
            custom_embed: formValues.custom_embed,
            availability: formValues.availability,
            instruments: formValues.instruments,
            equipment: formValues.equipment,
            space: formValues.space,
            dress_code: formValues.dress_code,
            artistGenres: formValues.artistGenres,
            locations: formValues.locations,
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
          <Button
            className={classes.uploadBtn}
            onClick={() => openWidget(name)}
            size="large"
            variant="contained"
          >
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
            {!formValues[name] && (
              <Typography variant="caption">
                {label} preview unavailable.
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
    );
  };

  const openWidget = (name) => {
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
          setFormValues((prevState) => {
            let newValues = { ...prevState };
            newValues[name] = result.info.secure_url;
            return newValues;
          });
        }
      },
    );
  };

  const onClearUpload = (key) => {
    setFormValues((prevState) => {
      let newValues = { ...prevState };
      newValues[key] = null;
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
      <CustomDialogTitle id="dialog-form-title" onClose={handleClose}>{capitalize(mode)} Artist</CustomDialogTitle>

      <DialogContent>
        <AddEditDialogTabs
          mode={mode}
          style={{ marginBottom: theme.spacing(2) }}
          onChange={handleTabChange}
        />
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
                  label="Name"
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
                <TextField
                  variant="outlined"
                  className={classes.textField}
                  name="instruments"
                  label="Instruments"
                  value={formValues.instruments || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  variant="outlined"
                  className={classes.textField}
                  name="equipment"
                  label="Equipment"
                  value={formValues.equipment || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  variant="outlined"
                  className={classes.textField}
                  name="space"
                  label="Space"
                  value={formValues.space || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  variant="outlined"
                  className={classes.textField}
                  name="dress_code"
                  label="Dress Code"
                  value={formValues.dress_code || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
                    startAdornment: <InputAdornment position="start"><span
                      style={{ color: theme.palette.text.light }}>$</span></InputAdornment>,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  variant="outlined"
                  className={classes.textField}
                  name="availability"
                  label="Availability"
                  value={formValues.availability || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Autocomplete
                  id="artistType"
                  className={classes.autocomplete}
                  options={lookups.artistTypes}
                  getOptionLabel={option => typeof option === 'object' ? option.name : lookups.artistTypes.find(x => x.id === option).name}
                  getOptionSelected={(option, value) => option.id === value}
                  value={formValues.artist_type_id}
                  disableClearable={true}
                  onChange={(event, newValue) => {
                    handleChange({ target: { name: 'artist_type_id', value: newValue } });
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Artist Type"
                      size="medium"
                      placeholder=""
                      fullWidth={false}
                      className={classes.textField}
                      InputLabelProps={{
                        ...params.InputLabelProps,
                        shrink: true,
                      }}
                    />
                  )}
                />
                <TextField
                  disabled
                  error={!!errorMessages.rating}
                  helperText={errorMessages.rating && errorMessages.rating}
                  variant="outlined"
                  className={classes.textField}
                  name="rating"
                  label="Rating (Auto-updated by Reviews)"
                  value={formValues.rating || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Autocomplete
                  id="artistGenres"
                  multiple
                  options={lookups.artistGenres}
                  getOptionLabel={option => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  value={formValues.artistGenres || []}
                  onChange={(event, newValue) => {
                    handleChange({ target: { name: 'artistGenres', value: newValue } });
                    console.log(event, newValue);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Artist Genres"
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
                <Autocomplete
                  id="locations"
                  multiple
                  options={lookups.locations}
                  getOptionLabel={option => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  value={formValues.locations || []}
                  onChange={(event, newValue) => {
                    handleChange({ target: { name: 'locations', value: newValue } });
                    console.log(event, newValue);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Locations"
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
                  error={!!errorMessages.video_url}
                  helperText={errorMessages.video_url && errorMessages.video_url}
                  variant="outlined"
                  className={classes.textField}
                  name="video_url"
                  label="Youtube Video ID"
                  value={formValues.video_url || ''}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {formValues.video_url && (
                  <YouTube id={formValues.video_url} className={classes.videoFrame} />
                )}
                <TextField
                  fullWidth
                  variant="outlined"
                  className={classes.textField}
                  name="custom_embed"
                  label="Custom Embed Code"
                  value={formValues.custom_embed || ''}
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
                  value={moment(formValues.created).add(moment().utcOffset(), 'minutes').format('MM/DD/yyyy h:mma') || ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControlLabel
                  control={<IOSSwitch checked={formValues.active === true} onChange={handleSwitchChange}
                                      name="active" />}
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
            )}
          </form>
        </>
        {tabNum === 2 && (
          <Box mt={2} mb={2}>
            {data.Bookings.length === 0 && (
              <Paper>
                <Box p={4}>
                  <Typography variant="body1" align="center">There are no bookings for this artist.</Typography>
                </Box>
              </Paper>
            )}
            {data.Bookings.length > 0 && (
              <TableContainer component={Paper}>
                <Table className={classes.table} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Contact Name</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Time</TableCell>
                      <TableCell align="right">Conf. Code</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.Bookings.map((booking, index) => (
                      <BookingTableRow key={index} booking={booking} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
        {tabNum === 3 && (
          <Box mt={2} mb={2}>
            {data.Reviews.length === 0 && (
              <Paper>
                <Box p={4}>
                  <Typography variant="body1" align="center">There are no reviews for this artist.</Typography>
                </Box>
              </Paper>
            )}
            {data.Reviews.length > 0 && (
              <TableContainer component={Paper}>
                <Table className={classes.table} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Author</TableCell>
                      <TableCell>Review</TableCell>
                      <TableCell align="right">Rating</TableCell>
                      <TableCell align="right">Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.Reviews.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.author_name}<br />{row.author_title}
                        </TableCell>
                        <TableCell>{row.review}</TableCell>
                        <TableCell align="right">{row.rating}</TableCell>
                        <TableCell align="right">{moment(row.created).format('MM/DD/yyyy h:mma')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const useRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  bookingDetails: {
    color: theme.palette.text.light,
    '& span': {
      color: '#fff',
    },
  },
}));

function BookingTableRow(props) {
  const { booking } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const theme = useTheme();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {booking.contact_firstname} {booking.contact_lastname}
        </TableCell>
        <TableCell align="right">${booking.fee_total}</TableCell>
        <TableCell
          align="right">{moment(booking.start_time).add(moment().utcOffset(), 'minutes').format('dddd, MMMM Do, YYYY')}</TableCell>
        <TableCell
          align="right">{moment(booking.start_time).add(moment().utcOffset(), 'minutes').format('LT') + ' - ' + moment(booking.start_time).add(moment().utcOffset(), 'minutes').add(booking.duration, 'minutes').format('LT')}</TableCell>
        <TableCell align="right">{booking.confirmation_code}</TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: '#111' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" color="textSecondary" gutterBottom component="div">
                Booking Details
              </Typography>
              <Grid container spacing={2} className={classes.bookingDetails}>
                <Grid item md={12}>
                  <Divider />
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    First Name<br />
                    <span>{booking.contact_firstname}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Last Name<br />
                    <span>{booking.contact_lastname}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Email<br />
                    <span>{booking.contact_email}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Address:<br />
                    <span>
                      {booking.contact_address1}<br />
                      {booking.contact_address2 && (
                        <>{booking.contact_address2}<br /></>
                      )}
                      {booking.contact_city}, {booking.contact_state} {booking.contact_zipcode}
                    </span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Date<br />
                    <span>{moment(booking.start_time).add(moment().utcOffset(), 'minutes').format('dddd, MMMM Do, YYYY')}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Time<br />
                    <span>{moment(booking.start_time).add(moment().utcOffset(), 'minutes').format('LT')} - {moment(booking.end_time).add(moment().utcOffset(), 'minutes').format('LT')}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Event Style<br />
                    <span>{booking.event_style}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Song Requests<br />
                    <span>{booking.event_song_requests}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Special Requests<br />
                    <span>{booking.event_special_requests}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Card Brand<br />
                    <span>{booking.card_brand}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Card Last4<br />
                    <span>{booking.card_last4}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Card Receipt URL<br />
                    <span><a href={booking.card_receipt_url} style={{ color: theme.palette.text.secondary }}
                             target="_blank" rel="noopener noreferrer">View Receipt</a></span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Duration Fee<br />
                    <span>${booking.fee_duration}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Service Fee<br />
                    <span>${booking.fee_service}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Total Fee<br />
                    <span>${booking.fee_total}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Confirmation Code<br />
                    <span>{booking.confirmation_code}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Zoom Meeting ID<br />
                    <span>{booking.zoom_meeting_identifier}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Zoom Meeting Passcode<br />
                    <span>{booking.zoom_meeting_passcode}</span>
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1" gutterBottom>
                    Created<br />
                    <span>{moment(booking.created).add(moment().utcOffset(), 'minutes').format('MM/DD/yyyy hh:mma')}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

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
