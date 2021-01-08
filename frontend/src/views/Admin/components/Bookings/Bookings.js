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

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  inputTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
}));

const Bookings = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const Columns = [
    { title: 'Name', field: 'name', show: false },
    { title: 'Code', field: 'confirmation_code' },
    { title: 'Event Date', field: 'start_time', render: rowData => moment(rowData.start_time).add(moment().utcOffset(), 'minutes').format('MM/DD/yyyy h:mma') },
    { title: 'Created', field: 'created', render: rowData => moment(rowData.created).add(moment().utcOffset(), 'minutes').format('MM/DD/yyyy') },
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
            title="Bookings"
            columns={Columns}
            endpoint="admin/bookings"
            allowAdd={false}
            allowDelete={false}
            allowEdit={false}
            allowView={true}
            addEditDialogLookups={lookups}
            AddEditDialog={AddEditDialog}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Bookings.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Bookings;
