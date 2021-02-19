import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import DataAdminTable from '../../../../common/DataAdminTable';
import AddEditDialog from './AddEditDialog';
import { Visibility, VisibilityOff } from '@material-ui/icons';
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

const Concerts = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const Columns = [
    { title: 'Name', field: 'name' },
    {
      title: 'Date',
      field: 'concert_time',
      render: rowData =>
        moment(rowData.concert_time)
          .add(moment().utcOffset(), 'minutes')
          .format('MMM D, YYYY '),
    },
    {
      title: 'Time',
      field: 'concert_time',
      render: rowData =>
        moment(rowData.concert_time)
          .add(moment().utcOffset(), 'minutes')
          .format('h:m A'),
    },
    { title: 'Rate', field: 'rate', render: rowData => `$${rowData.rate}` },
    {
      title: 'Active',
      field: 'active',
      render: rowData =>
        rowData.active === true ? <Visibility /> : <VisibilityOff style={{ color: 'rgba(255, 255, 255, 0.3)' }} />,
    },
  ];

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <DataAdminTable title="Concerts" columns={Columns} endpoint="admin/concerts" AddEditDialog={AddEditDialog} />
        </Grid>
      </Grid>
    </div>
  );
};

Concerts.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Concerts;
