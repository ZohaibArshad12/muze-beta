import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
} from '@material-ui/core';
import DataAdminTable from '../../../../common/DataAdminTable';
import AddEditDialog from './AddEditDialog';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  inputTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
}));

const Artists = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const Columns = [
    { title: 'Name', field: 'name' },
    { title: 'Artist Type', field: 'artist_type_id', render: rowData => rowData.ArtistType.name },
    { title: 'Rate', field: 'rate', render: rowData => `$${rowData.rate}` },
    { title: 'Rating', field: 'rating' },
    { title: 'Active', field: 'active', render: rowData => rowData.active === true ? <Visibility/> : <VisibilityOff style={{color: 'rgba(255, 255, 255, 0.3)' }}/>},
  ];

  const artistTypesQuery = useQuery(`artistTypesQuery`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/artist-types`);
    return data;
  });

  const artistGenresQuery = useQuery(`artistGenresQuery`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/artist-genres`);
    return data;
  });

  const locationsQuery = useQuery(`locationsQuery`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/locations`);
    return data;
  });

  const [lookups, setLookups] = useState({
    artistTypes: [],
    artistGenres: [],
    locations: [],
  });

  useEffect(() => {
    setLookups({
      artistTypes: artistTypesQuery.data,
      artistGenres: artistGenresQuery.data,
      locations: locationsQuery.data,
    });
  }, [artistTypesQuery.data, artistGenresQuery.data, locationsQuery.data]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <DataAdminTable
            title="Artists"
            columns={Columns}
            endpoint="admin/artists"
            addEditDialogLookups={lookups}
            AddEditDialog={AddEditDialog}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Artists.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Artists;
