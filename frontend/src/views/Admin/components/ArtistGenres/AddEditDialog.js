import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField, Typography,
} from '@material-ui/core';
import { useAuth0 } from "../../../../hooks/useAuth0";
import { capitalize } from "../../../../utils";
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
    textField: {
        width: 268,
        margin: theme.spacing(1, 1, 1, 0),
    },
    dropdown: {
        width: 268,
        margin: theme.spacing(1, 1, 1, 0),
    },
    picker: {
        width: 268,
        margin: theme.spacing(1, 1, 1, 0),
    },
    activeSwitch: {
        position: 'absolute',
        top: '10px',
        right: '60px',
    },
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
    setWaitingState
}) => {
    const classes = useStyles();
    const { getTokenSilently } = useAuth0();
    const theme = useTheme();

    const [formValues, setFormValues] = useState({});
    const hasErrors = useRef(false);

    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        if (open === true) {
            if (data.active === '' || typeof data.active === 'undefined') {
                data.active = true;
            }
            hasErrors.current = false;
            setErrorMessages({});
            setFormValues(data);
        }
    }, [open, data])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setErrorMessages(prev => ({...prev, [name]: false}));
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

    const formIsValid = () => {
        hasErrors.current = false;
        setErrorMessages({});

        if (!formValues.name) {
            addError('name', 'Name is required.');
        }

        return !hasErrors.current;
    };

    const addError = (key, message) => {
        hasErrors.current = true;
        setErrorMessages(prev => ({ ...prev, [key]: message}));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formIsValid()) return;
        setWaitingState("in progress");
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
                    sort_order: formValues.sort_order,
                    active: formValues.active,
                } : { // mode === edit
                      id: formValues.id,
                      name: formValues.name,
                      sort_order: formValues.sort_order,
                      active: formValues.active,
                },
                { headers }
            );
            handleRefresh();
            setWaitingState("complete", "no error");
            handleClose();
        } catch (err) {
            console.error(err);
            setWaitingState("complete", "error");
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

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="dialog-form-title"
            maxWidth="sm"
            style={{ height: 600 }}
        >
            <CustomDialogTitle id="dialog-form-title" onClose={handleClose}>{capitalize(mode)} Artist Genre</CustomDialogTitle>
            <DialogContent>
                <DialogContentText style={{color: theme.palette.text.light}}>
                    Use the following form to {mode} an artist genre.
                </DialogContentText>
                <form method="post" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        error={!!errorMessages.name}
                        helperText={errorMessages.name && errorMessages.name}
                        variant="outlined"
                        className={classes.textField}
                        name="name"
                        label="Name"
                        value={formValues.name || ""}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                      variant="outlined"
                      className={classes.textField}
                      name="sort_order"
                      label="Sort Order"
                      value={formValues.sort_order}
                      onChange={handleChange}
                      InputLabelProps={{
                          shrink: true,
                      }}
                    />
                    <FormControlLabel
                      control={<IOSSwitch checked={formValues.active === true} onChange={handleSwitchChange} name="active" />}
                      label="Active"
                      className={classes.activeSwitch}
                    />
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
                </form>
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
