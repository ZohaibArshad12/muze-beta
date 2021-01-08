import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Select as MaterialSelect,
  MenuItem,
} from '@material-ui/core';
import { setWidth, setClass } from '../../../utils';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  FormControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    '& label': {
      color: props => props.labelColor,
    },
  },
  outlinedFormControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    '& fieldset': {
      borderColor: props => props.outlineColor,
      borderWidth: 1.5,
    },
    '& label': {
      color: props => props.labelColor,
    },
    '& div': {
      backgroundColor: props => props.fillColor,
    },
    '& div:hover': {
      backgroundColor: props => props.fillColor,
    },
    '& div:focus': {
      backgroundColor: props => props.fillColor,
    },
    '& input:hover': {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    '& input:focus': {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
  },
  filledFormControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    '& div': {
      backgroundColor: props => props.fillColor,
    },
    '& div:hover': {
      backgroundColor: props => props.fillColor,
    },
    '& div:focus': {
      backgroundColor: props => props.fillColor,
    },
    '& input:hover': {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    '& input:focus': {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    '& label': {
      color: props => props.labelColor,
    },
  },
}));

const Select = props => {
  const {
    name,
    label,
    valueField = 'id',
    displayField = 'name',
    data = [],
    value = '',
    variant = 'outlined',
    onChange,
    width,
    outlineColor,
    fillColor,
    labelColor,
    className,
    ...other
  } = props;
  const classes = useStyles({ outlineColor, fillColor, labelColor });

  return (
    <FormControl
      className={clsx(setClass(classes, variant, 'FormControl'), className)}
      variant={variant}
      style={{ width: setWidth(width, other.fullWidth) }}
      {...other}
    >
      <InputLabel id={name}>{label}</InputLabel>
      <MaterialSelect
        data-testid="single-select"
        labelId={`${name}-label`}
        id={name}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        InputLabelProps={{
          shrink: true,
        }}
      >
        {data.map(val => (
          <MenuItem key={`val[valueField]`} value={val[valueField]}>
            {val[displayField]}
          </MenuItem>
        ))}
      </MaterialSelect>
    </FormControl>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  variant: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  outlineColor: PropTypes.string,
  fillColor: PropTypes.string,
  labelColor: PropTypes.string,
};

export default Select;