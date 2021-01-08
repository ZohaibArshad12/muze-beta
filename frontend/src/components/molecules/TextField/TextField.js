import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { lighten, TextField as MaterialTextField } from '@material-ui/core';
import { setInputColor, setWidth, setClass } from "../../../utils";

const useStyles = makeStyles(theme => ({
  TextField: {
    "& label": {
      color: props => setInputColor(props.labelColor, theme)
    }
  },
  outlinedTextField: {
    margin: theme.spacing(1),
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.textField.borderMain,
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.textField.borderHover,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.textField.borderFocus,
    },
    "& .MuiOutlinedInput-input": {
      color: theme.palette.textField.textMain,
    },
    "&:hover .MuiOutlinedInput-input": {
      color: theme.palette.textField.textHover,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: theme.palette.textField.textFocus,
    },
    "& .MuiInputLabel-outlined": {
      color: theme.palette.textField.labelMain,
    },
    "&:hover .MuiInputLabel-outlined": {
      color: theme.palette.textField.labelHover,
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: theme.palette.textField.labelFocus,
    },
  },
  filledTextField: {
    margin: theme.spacing(1),
    "& div": {
      backgroundColor: props => setInputColor(props.fillColor, theme, 0.85)
    },
    "& div:hover": {
      backgroundColor: props => setInputColor(props.fillColor, theme, 0.75)
    },
    "& div:focus": {
      backgroundColor: props => setInputColor(props.fillColor, theme, 0.75)
    },
    "& input:hover": {
      backgroundColor: props => setInputColor(props.fillColor, theme, 0.75),
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    },
    "& input:focus": {
      backgroundColor: props => setInputColor(props.fillColor, theme, 0.75),
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    },
    "& label": {
      color: props => setInputColor(props.labelColor, theme)
    }
  }
}));

const TextField = props => {
  const {
    name,
    label,
    value,
    variant,
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
    <MaterialTextField
      data-testid="text-field"
      id={name}
      name={name}
      variant={variant}
      label={label}
      value={value}
      onChange={onChange}
      className={`${className} ${setClass(classes, variant)}`}
      style={{ width: setWidth(width, other.fullWidth) }}
      {...other}
    />
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  variant: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number,
  outlineColor: PropTypes.string,
  fillColor: PropTypes.string,
  labelColor: PropTypes.string
};

export default TextField;