import { createMuiTheme, responsiveFontSizes, darken, colors } from '@material-ui/core';

import palette from './palette';

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: palette,
    lightPurple: colors.deepPurple[300],
    typography: {
      fontFamily: 'Lato',
    },
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
    overrides: {
      MuiOutlinedInput: {
        root: {
          "& $notchedOutline": {
            borderColor: palette.textField.borderMain,
          },
          "&:hover $notchedOutline": {
            borderColor: palette.textField.borderHover,
          },
          "&$focused $notchedOutline": {
            borderColor: palette.textField.borderFocus,
          },
          "&$focused input": {
            color: palette.textField.textFocus,
          }
        },
        input: {
          color: palette.textField.textMain,
          "&:hover": {
            color: palette.textField.textHover,
          }
        }
      },
      MuiInputLabel: {
        root: {
          "& $outlined": {
            color: palette.textField.labelMain,
          },
          "&:hover $outlined": {
            color: palette.textField.labelHover,
          },
          "&$focused$outlined": {
            color: palette.textField.labelFocus,
          },
        },
      },
      MuiDialog: {
        paper: {
          backgroundColor: palette.background.topnav
        }
      },
      MuiButton: {
        containedSecondary: {
          color: 'white',
        },
      },
      MuiPickersClockPointer: {
        pin: {
          backgroundColor: palette.secondary.main,
        },
        pointer: {
          backgroundColor: palette.secondary.main,
        },
        noPoint: {
          backgroundColor: palette.secondary.main,
        },
        thumb: {
          borderColor: palette.secondary.main,
          backgroundColor: palette.secondary.main,
        },
      },
      MuiPickersDay: {
        day: {
          color: palette.white
        },
        daySelected: {
          backgroundColor: palette.secondary.main
        },
        current: {
          color: palette.white,
        },
      },
      MuiStepIcon: {
        root: {
          '&$completed': {
            color: palette.text.secondary,
          },
          '&$active': {
            color: palette.text.secondary,
          },
        }
      },
      MuiCssBaseline: {
        '@global': {
          '::-moz-selection': {
            color: palette.white,
            background: palette.text.secondary,
          },
          '::selection': {
            color: palette.white,
            background: palette.text.secondary,
          },
          ['input:-webkit-autofill,' +
          'input:-webkit-autofill:hover,' +
          'input:-webkit-autofill:focus,' +
          'textarea:-webkit-autofill,' +
          'textarea:-webkit-autofill:hover,' +
          'textarea:-webkit-autofill:focus,' +
          'select:-webkit-autofill,' +
          'select:-webkit-autofill:hover,' +
          'select:-webkit-autofill:focus']: {
            '-webkit-box-shadow': `0 0 0px 1000px ${darken(colors.deepPurple[300], .5)} inset !important`,
          },
          '*::-webkit-scrollbar': {
            width: '0.8em'
          },
          '*::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,.2)',
            border: 'none',
            borderRadius: '8px'
          }
        }
      }
    },
  }),
);

export default theme;
