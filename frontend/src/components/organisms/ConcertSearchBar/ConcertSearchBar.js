import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, colors } from '@material-ui/core';
import CardBase from '../CardBase';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useApp } from '../../../AppProvider';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  searchGrid: {
    zIndex: 3,
    marginTop: theme.spacing(4),
    '& > div > div': {},
  },
  searchGridText: {
    maxWidth: 605,
  },
  dropdown: {
    width: '100%',
  },
  dropdownLight: {
    width: '100%',
  },
  textField: {
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.textField.borderMain,
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.textField.borderHover,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.textField.borderFocus,
    },
    '& .MuiOutlinedInput-input': {
      color: theme.palette.textField.textMain,
    },
    '&:hover .MuiOutlinedInput-input': {
      color: theme.palette.textField.textHover,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
      color: theme.palette.textField.textFocus,
    },
    '& .MuiInputLabel-outlined': {
      color: theme.palette.textField.labelMain,
    },
    '&:hover .MuiInputLabel-outlined': {
      color: theme.palette.textField.labelHover,
    },
    '& .MuiInputLabel-outlined.Mui-focused': {
      color: theme.palette.textField.labelFocus,
    },
  },
  textFieldLight: {
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.textFieldLight.borderMain,
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.textFieldLight.borderHover,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.textFieldLight.borderFocus,
    },
    '& .MuiOutlinedInput-input': {
      color: theme.palette.textFieldLight.textMain,
    },
    '&:hover .MuiOutlinedInput-input': {
      color: theme.palette.textFieldLight.textHover,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
      color: theme.palette.textFieldLight.textFocus,
    },
    '& .MuiInputLabel-outlined': {
      color: theme.palette.textFieldLight.labelMain,
    },
    '&:hover .MuiInputLabel-outlined': {
      color: theme.palette.textFieldLight.labelHover,
    },
    '& .MuiInputLabel-outlined.Mui-focused': {
      color: theme.palette.textFieldLight.labelFocus,
    },
  },
  searchButton: {
    width: '100%',
    height: '100%',
  },
  searchIcon: {
    color: colors.grey[600],
  },
  searchIconLight: {
    color: colors.deepPurple[300],
  },
  datePicker: {
    '& .pickerNoDate': {
      visibility: 'hidden',
    },
    '& .pickerHasDate': {
      visibility: 'hidden',
    },
    '&:hover .pickerNoDate': {
      visibility: 'hidden',
    },
    '&:hover .pickerHasDate': {
      visibility: 'visible',
    },
  },
}));

/**
 * Component to display the concert search bar
 *
 * @param {Object} props
 */
const ConcertSearchBar = props => {
  const { className, light, ...rest } = props;
  const [filterValue, setFilterValue] = useState(null);
  const classes = useStyles();
  const app = useApp();

  const handleSearch = () => {
    app.setConcertSearchValue(filterValue);
  };
  const clearSearch = () => {
    setFilterValue(null);
    app.setConcertSearchValue(null);
  };

  return (
    <Grid item xs={12} className={classes.searchGrid}>
      <CardBase
        variant="outlined"
        className={clsx('artist-search-bar', classes.root, className)}
        light={light}
        {...rest}
      >
        <Grid container spacing={2} justify="space-evenly">
          <Grid item xs={12} md={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                autoOk
                disableToolbar
                disablePast
                variant="inline"
                inputVariant="outlined"
                format="MM/dd/yyyy"
                margin="normal"
                id="date"
                label="Date"
                className={clsx(classes.datePicker, light ? classes.textFieldLight : classes.textField)}
                value={filterValue}
                onChange={newValue => setFilterValue(newValue)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className={clsx('fas fa-calendar', light ? classes.searchIconLight : classes.searchIcon)} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton
                      edge="end"
                      size="small"
                      className={!filterValue ? 'pickerNoDate' : 'pickerHasDate'}
                      style={{ visibility: !filterValue ? 'hidden' : 'visible' }}
                      onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        clearSearch();
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              className={classes.searchButton}
              size="large"
              variant="contained"
              onClick={handleSearch}
              color={light ? 'default' : 'secondary'}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </CardBase>
    </Grid>
  );
};

ConcertSearchBar.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default ConcertSearchBar;
