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
import moment from 'moment';
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

const Reviews = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const Columns = [
    { title: 'Artist', field: 'artist_id', render: rowData => rowData.Artist.name },
    { title: 'Author', field: 'author_name' },
    { title: 'Rating', field: 'rating' },
    { title: 'Created', field: 'created', render: rowData => moment(rowData.created).format('MM/DD/yyyy') },
    { title: 'Active', field: 'active', render: rowData => rowData.active === true ? <Visibility/> : <VisibilityOff style={{color: 'rgba(255, 255, 255, 0.3)' }}/>},
  ];

  const artistsQuery = useQuery(`artistsQuery`, async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/artists`);
    return data;
  });

  const [lookups, setLookups] = useState({
    artists: [],
  });

  useEffect(() => {
    setLookups({
      artists: artistsQuery.data,
    });
  }, [artistsQuery.data]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <DataAdminTable
            title="Reviews"
            columns={Columns}
            endpoint="admin/reviews"
            addEditDialogLookups={lookups}
            AddEditDialog={AddEditDialog}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Reviews.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Reviews;
