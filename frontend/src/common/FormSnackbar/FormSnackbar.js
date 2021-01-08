import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, SnackbarContent, colors } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    '& .MuiSnackbarContent-message': {
      textAlign: 'center',
      width: '100%',
    },
  },
  snackbarSuccess: {
    backgroundColor: colors.green[500],
    color: 'white',
  },
  snackbarError: {
    backgroundColor: colors.red[500],
    color: 'white',
  },
}));

const FormSnackbar = (props) => {
  const classes = useStyles();
  const {
    open,
    error,
    errorMessage = 'There was an error saving the data.',
    successMessage = 'Data successfully saved!',
    handleClose,
  } = props;

  return (
    <Snackbar

      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={clsx(classes.snackbar, error ? classes.snackbarError : classes.snackbarSuccess)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar">
            {error ? errorMessage : successMessage}
          </span>
        }
      />
    </Snackbar>
  );
};

FormSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};

export default FormSnackbar;
