import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, colors, TextField, useMediaQuery, useTheme } from '@material-ui/core';
import CardBase from '../CardBase';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useApp } from '../../../AppProvider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  DateTimePicker,
} from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { goTo } from '../../../utils';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  searchGrid: {
    zIndex: 3,
    marginTop: theme.spacing(4),
    '& > div > div': {
      //padding: theme.spacing(2,2),
    },
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
 * Component to display the artist search bar
 *
 * @param {Object} props
 */
const ArtistSearchBar = props => {
  const {
    className,
    light,
    ...rest
  } = props;

  let { locationId, artistTypeId, artistGenreId } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const app = useApp();
  const dateFilterEnabled = false;
  const dateTimeFilterEnabled = true;
  const locationFilterEnabled = false;
  const artistTypeFilterEnabled = true;
  const artistGenreFilterEnabled = true;

  const handleSearch = () => {
    if (history.location.pathname === '/' || history.location.pathname === '/home') {
      goTo(history, 'browse');
    }
    app.doSearch();
  };

  useEffect(() => {
    if (locationId || artistTypeId || artistGenreId) {
      app.setFilterValues((prevState) => {
        let newValues = { ...prevState };

        newValues['artistType'] = app.data.artistTypes.find(x => x.id === parseInt(artistTypeId)) || null;
        newValues['artistGenre'] = app.data.artistGenres.find(x => x.id === parseInt(artistGenreId)) || null;
        newValues['location'] = app.data.locations.find(x => x.id === parseInt(locationId)) || null;

        app.handleFilterValuesChange({
          target: {
            name: 'artistType',
            value: app.data.artistTypes.find(x => x.id === parseInt(artistTypeId)) || null
          }
        })
        app.handleFilterValuesChange({
          target: {
            name: 'artistGenre',
            value: app.data.artistGenres.find(x => x.id === parseInt(artistGenreId)) || null
          }
        })
        app.handleFilterValuesChange({
          target: {
            name: 'location',
            value: app.data.locations.find(x => x.id === parseInt(locationId)) || null
          }
        })
        return newValues;
      });
    }
  }, [locationId, artistTypeId, artistGenreId, app.data.artistTypes, app.data.artistGenres, app.data.locations]); //eslint-disable-line

  return (
    <Grid item xs={12} className={classes.searchGrid}>
      <CardBase variant="outlined"
                className={clsx(
                  'artist-search-bar',
                  classes.root,
                  className,
                )}
                light={light}
                {...rest}
      >
        <Grid container spacing={2}>
          {locationFilterEnabled && app.filterValues.location.length > 0 && (
            <Grid item xs={12} md={3}>
              <Autocomplete
                id="location"
                options={app.data.locations}
                getOptionLabel={option => option.name}
                getOptionSelected={(option, value) => option.id === value.id}
                value={app.filterValues.location || null}
                disableClearable={false}
                onChange={(event, newValue) => {
                  return app.handleFilterValuesChange({ target: { name: 'location', value: newValue } });
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Location"
                    size={isMd ? 'medium' : 'small'}
                    placeholder=""
                    className={light ? classes.textFieldLight : classes.textField}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      shrink: true,
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <i
                            className={clsx(
                              'fas fa-map-marker-alt',
                              light ? classes.searchIconLight : classes.searchIcon,
                            )}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          )}
          {dateFilterEnabled && (
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
                  value={app.filterValues.date}
                  onChange={newValue => app.handleFilterValuesChange({ target: { name: 'date', value: newValue } })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i
                          className={clsx(
                            'fas fa-calendar',
                            light ? classes.searchIconLight : classes.searchIcon,
                          )}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        edge="end"
                        size="small"
                        className={!app.filterValues.date ? 'pickerNoDate' : 'pickerHasDate'}
                        //style={{ visibility: !app.filterValues.date ? 'hidden' : 'visible' }}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          app.handleFilterValuesChange({ target: { name: 'date', value: null } });
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          )}
          {dateTimeFilterEnabled && (
            <Grid item xs={12} md={3}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  autoOk
                  disablePast
                  minutesStep={5}
                  variant="inline"
                  inputVariant="outlined"
                  format="MM/dd/yyyy h:mma"
                  margin="normal"
                  id="date"
                  label="Date"
                  className={clsx(classes.datePicker, light ? classes.textFieldLight : classes.textField)}
                  value={app.filterValues.date}
                  onChange={newValue => app.handleFilterValuesChange({ target: { name: 'date', value: newValue } })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i
                          className={clsx(
                            'fas fa-calendar',
                            light ? classes.searchIconLight : classes.searchIcon,
                          )}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        edge="end"
                        size="small"
                        className={!app.filterValues.date ? 'pickerNoDate' : 'pickerHasDate'}
                        //style={{ visibility: !app.filterValues.date ? 'hidden' : 'visible' }}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          app.handleFilterValuesChange({ target: { name: 'date', value: null } });
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          )}
          {artistTypeFilterEnabled && app.data.artistTypes.length > 0 && (
            <Grid item xs={12} md={3}>
              <Autocomplete
                id="artistType"
                options={app.data.artistTypes}
                getOptionLabel={option => option.name}
                getOptionSelected={(option, value) => option.id === value.id}
                value={app.filterValues.artistType || null}
                disableClearable={false}
                onChange={(event, newValue) => {
                  return app.handleFilterValuesChange({ target: { name: 'artistType', value: newValue } });
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Artist Type"
                    size={isMd ? 'medium' : 'small'}
                    placeholder=""
                    className={light ? classes.textFieldLight : classes.textField}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      shrink: true,
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <i
                            className={clsx(
                              'fas fa-search',
                              light ? classes.searchIconLight : classes.searchIcon,
                            )}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          )}
          {artistGenreFilterEnabled && app.data.artistGenres.length > 0 && (
            <Grid item xs={12} md={3}>
              <Autocomplete
                id="artistGenre"
                options={app.data.artistGenres}
                getOptionLabel={option => option.name}
                getOptionSelected={(option, value) => option.id === value.id}
                value={app.filterValues.artistGenre || null}
                disableClearable={false}
                onChange={(event, newValue) => {
                  return app.handleFilterValuesChange({ target: { name: 'artistGenre', value: newValue } });
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Artist Genre"
                    size={isMd ? 'medium' : 'small'}
                    placeholder=""
                    className={light ? classes.textFieldLight : classes.textField}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      shrink: true,
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <i
                            className={clsx(
                              'fas fa-music',
                              light ? classes.searchIconLight : classes.searchIcon,
                            )}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          )}
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

ArtistSearchBar.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default ArtistSearchBar;
