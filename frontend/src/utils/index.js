import { lighten } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

/**
 * Utility method for extracting the date in "YYYY-MM-DD" format
 * Ideal for extracting the date for a Material-UI date picker
 * @param {*} date
 */
export const extractDate = date => {
  if (date) {
    const properDate = new Date(date);
    const year = properDate.getFullYear();
    const month =
      properDate.getMonth() + 1 < 10
        ? `0${properDate.getMonth() + 1}`
        : properDate.getMonth() + 1;
    const day =
      properDate.getDate() < 10
        ? `0${properDate.getDate()}`
        : properDate.getDate();
    return `${year}-${month}-${day}`;
  }
  return '';
};

/**
 * Utility function used to programatically navigate to a new route
 * @param {object} history React Router history
 * @param {string} route path to navigate to
 */
export const goTo = (history, route) => {
  history.push(`/${route}`);
};

/**
 * Utility function to capitalize first letter of a string
 * @param str
 * @returns {string}
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Utility function to determine if a value is a number
 * Works with numbers typed as strings:
 * isNumber('123'); // true
 * isNumber('123abc'); // false
 * isNumber(5); // true
 * isNumber('q345'); // false
 * isNumber(null); // false
 * isNumber(undefined); // false
 * isNumber(false); // false
 * isNumber('   '); // false
 * @param n
 * @returns {boolean|boolean}
 */
export const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};

/**
 * Utility function to generate an array of numbers in a range
 * @param {number} start
 * @param {number} stop
 * @param {number} step
 */
export const range = (start, stop, step = 1) => {
  let a = [start], b = start;
  while (b < stop) {
    a.push(b += step || 1);
  }
  return a;
};

/**
 * Utility function used to set the appropriate color
 * for a Material UI form input
 * @param {Enumerator} color enum "primary", "secondary", "info", "error"
 * @param {object} theme Material UI theme
 * @param {number} lightenFactor factor to lighten color by
 */
export const setInputColor = (color, theme, lightenFactor) => {
  const validColorOptions = ['primary', 'secondary', 'info', 'error'];
  if (validColorOptions.includes(color)) {
    if (lightenFactor) {
      return lighten(theme.palette[color].main, lightenFactor);
    }
    return theme.palette[color].main;
  }
  return null;
};

/**
 * Utility function used to assign the proper
 * class based on the variant
 * @param {string} variant i.e. standard, outlined, filled
 */
export const setClass = (classes, variant, classSuffix = 'TextField') => {
  if (variant === 'outlined') {
    return classes[`outlined${classSuffix}`];
  } else if (variant === 'filled') {
    return classes[`filled${classSuffix}`];
  } else {
    return classes[classSuffix];
  }
};

/**
 * Utility function used to return the appropriate width
 * for a form element
 * @param {number} width
 * @param {boolean} fullWidth
 */
export const setWidth = (width, fullWidth) => {
  if (fullWidth) {
    return '100%';
  } else if (width) {
    return width;
  } else {
    return 'inherit';
  }
};

export const rating = (score, className) => {
  const ratingArray = [];
  for (let i = 1; i <= 5; i += 1) {
    ratingArray.push(
      <i
        className={clsx(
          i <= score ? 'fas fa-star' : (
            parseFloat(i - 0.5) <= score ? 'fas fa-star-half-alt' : 'far fa-star'
          ),
          className,
        )}
        key={i}
      />,
    );
  }
  return ratingArray;
};

export const getArtistImageArrayFromObject = (data) => {
  const images = [];
  if (data.cover_img_url) images.push({ src: data.cover_img_url });
  if (data.image1_url) images.push({ src: data.image1_url });
  if (data.image2_url) images.push({ src: data.image2_url });
  if (data.image3_url) images.push({ src: data.image3_url });
  if (data.image4_url) images.push({ src: data.image4_url });
  return images;
};