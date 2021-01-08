import { colors, darken, lighten } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

const brand = {
  pink: '#F6BEF8',
  grey: '#485F72',
  dark: '#141313',
  light: '#ffffff'
};

export default {
  type: 'dark',
  primary: {
    main: brand.dark, //colors.grey[900],
    contrastText: '#fff',
  },
  secondary: {
    main: darken(colors.deepPurple['A200'], .20),
    contrastText: '#fff',
  },
  tertiary: {
    main: lighten(colors.deepPurple[300], 0.2),
    contrastText: '#fff'
  },
  background: {
    default: '#000',
    paper: '#000',
    topnav: '#1b1b1b',
    footer: brand.dark, //colors.grey[900]
  },
  textField: {
    borderMain: colors.grey[800],
    borderHover: lighten(colors.grey[800], .3),
    borderFocus: colors.deepPurple[300],
    textMain: white,
    textHover: white,
    textFocus: white,
    labelMain: colors.deepPurple[300],
    labelHover: colors.deepPurple[300],
    labelFocus: colors.deepPurple[300],
  },
  textFieldLight: {
    borderMain: colors.deepPurple[300],
    borderHover: white,
    borderFocus: white,
    textMain: white,
    textHover: white,
    textFocus: white,
    labelMain: white,
    labelHover: white,
    labelFocus: white,
  },
  black,
  white,
  alternate: darken(brand.dark, 0.3),
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400],
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400],
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400],
  },
  error: {
    contrastText: white,
    dark: '#fa755a',
    main: '#fa755a',
    light: '#fa755a',
  },
  text: {
    primary: white,
    light: colors.grey[500],
    secondary: colors.deepPurple[300],
    secondaryDark: darken(colors.deepPurple[300], .3),
    link: colors.deepPurple[300],
  },
  textHighlighted: {
    primary: 'red'
  },
  icon: colors.deepPurple[300],
  divider: colors.grey[800],
};
