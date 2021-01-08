import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Paper, makeStyles, useTheme } from '@material-ui/core';
import MaterialTable, { MTableBodyRow } from 'material-table';
import { useAuth0 } from '../../hooks/useAuth0';
import useFormSubmitStatus from '../../hooks/useFormSubmitStatus';
import FormSnackbar from '../FormSnackbar';
import useVisibility from '../../hooks/useVisibility';
import useFetchData from '../../hooks/useFetchData';
import { Info } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    '& th': {
      paddingLeft: theme.spacing(2),
    },
    '& td': {
      paddingLeft: `${theme.spacing(2)}px!important`,
      backgroundColor: 'black',
    },
  },
}));

/**
 * This component is used has a shortcut for creating a data management
 * table using the Material Table library.
 * For more information on the Material Table library, please visit
 * https://material-table.com/#/
 */
const DataAdminTable = ({
                          title = 'Manage Data',
                          columns,
                          updateHandler,
                          endpoint,
                          ndxField = 'id',
                          options = {},
                          components = {},
                          actions = [],
                          allowEdit = true,
                          allowDelete = true,
                          allowAdd = true,
                          allowView = false,
                          AddEditDialog,
                          addEditDialogLookups,
                          handleRefresh = () => {
                          },
                        }) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    setWaitingState,
    snackbarOpen,
    snackbarError,
    handleSnackbarClose,
  } = useFormSubmitStatus();
  const { getTokenSilently } = useAuth0();
  const [refreshSwitch, setRefreshSwitch] = useState(false);
  const [addEditOpen, setAddEditOpen] = useVisibility(false);
  const [addEditData, setAddEditData] = useState({});
  const [addEditMode, setAddEditMode] = useState('');

  const [data, loading, setData] = useFetchData(
    `${endpoint}`,
    [refreshSwitch],
  );

  const handleDelete = (record) => {
    return (async () => {
      setWaitingState('in progress');
      try {
        if (record) {
          const token = await getTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.delete(
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${record[ndxField]}`,
            { headers },
          );
          setData((prevState) => {
            const data = [...prevState];
            data.splice(data.indexOf(record), 1);
            return data;
          });
          handleRefresh();
          setWaitingState('complete', 'no error');
        } else {
          setWaitingState('complete', 'error');
        }
      } catch (err) {
        console.error(err);
        setWaitingState('complete', 'error');
      }
    })();
  };

  const handleViewActionClick = (event, rowData) => {
    setAddEditMode('view');
    setAddEditData(rowData);
    setAddEditOpen(true);
  };

  const handleEditActionClick = (event, rowData) => {
    setAddEditMode('edit');
    setAddEditData(rowData);
    setAddEditOpen(true);
  };

  const handleAddActionClick = (event, rowData) => {
    setAddEditMode('add');
    setAddEditData(rowData);
    setAddEditOpen(true);
  };

  return (
    <div className={classes.table}>
      <MaterialTable
        data={data}
        columns={columns}
        title={title}
        isLoading={loading}
        editable={
          allowDelete ?  { onRowDelete: handleDelete } : {}
        }
        components={{
          Row: (props) => <MTableBodyRow {...props} />,
          Container: (props) => <Paper variant="outlined" {...props}></Paper>,
          ...components,
        }}
        options={{
          emptyRowsWhenPaging: false,
          columnsButton: true,
          addRowPosition: 'first',
          actionsCellStyle: { justifyContent: 'center' },
          actionsColumnIndex: 0,
          pageSize: options.pageSize || 10,
          pageSizeOptions: options.pageSizeOptions || [10, 25, 50],
          headerStyle: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.link,
          },
          ...options,
        }}
        actions={[
          allowView ? {
            icon: () => <Info/>,
            tooltip: 'View',
            onClick: handleViewActionClick,
          } : null,
          allowEdit ? {
            icon: 'edit',
            tooltip: 'Edit',
            onClick: handleEditActionClick,
          } : null,
          allowAdd ? {
            icon: 'add',
            tooltip: 'Add',
            isFreeAction: true,
            onClick: handleAddActionClick,
          } : null,
          ...actions,
        ]}
      />
      <AddEditDialog
        open={addEditOpen}
        data={addEditData}
        mode={addEditMode}
        endpoint={endpoint}
        handleClose={() => setAddEditOpen(false)}
        handleRefresh={() => setRefreshSwitch((state) => !state)}
        lookups={addEditDialogLookups}
        setWaitingState={setWaitingState}
      />
      <FormSnackbar
        open={snackbarOpen}
        error={snackbarError}
        handleClose={handleSnackbarClose}
        successMessage="Operation completed successfully."
        errorMessage="An error occurred."
      />
    </div>
  );
};

DataAdminTable.propTypes = {
  /**
   * An array of objects representing the column
   * configuration for the table
   * [{ title: "Structure Name", field: "structure_name" }]
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    }),
  ),
  /**
   * Custom component overrides for the Material Table
   * Find more info at https://material-table.com/#/docs/features/component-overriding
   */
  components: PropTypes.object,
  /**
   * Root endpoint for the API routes related to the table
   * i.e. "structures"
   */
  endpoint: PropTypes.string,
  /**
   * Name of the table field that contains the key index values
   * for the table.
   * i.e. "structure_ndx"
   */
  ndxField: PropTypes.string,
  /**
   * Loading state for the table
   */
  loading: PropTypes.bool,
  /**
   * Title to be displayed above the table
   */
  title: PropTypes.string,
  /**
   * Function that will run whenever a table row is
   * added or modified
   */
  updateHandler: PropTypes.func,
  /**
   * Configuration options for the material table
   * All options can be found at https://material-table.com/#/docs/all-props
   */
  options: PropTypes.object,
  /**
   * An array of action configurations (i.e. add, edit) for
   * the material table
   * More info can be found at https://material-table.com/#/docs/features/actions
   */
  actions: PropTypes.array,
  /**
   * Function that runs whenever a table row is added or modified
   * Handler used to tell the parent component that data should
   * be refreshed
   */
  handleRefresh: PropTypes.func,
};

export default DataAdminTable;
