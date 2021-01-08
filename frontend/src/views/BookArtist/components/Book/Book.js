import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBooker } from 'components/organisms';
import 'date-fns';
import useTheme from '@material-ui/core/styles/useTheme';
import BookForm from '../BookForm';
import BookPayment from '../BookPayment';
import HorizontalStepper from '../../../../components/organisms/HorizontalStepper';
import BookReceipt from '../BookReceipt';

const useStyles = makeStyles(theme => ({
  root: {},
  typed: {
    fontWeight: 'bold',
  },
  listItemAvatar: {
    minWidth: 28,
  },
  formCover: {
    objectFit: 'cover',
    borderBottomLeftRadius: '40%',
  },
  cardBooker: {
    [theme.breakpoints.up('md')]: {
      maxWidth: 400,
    },
  },
}));

const Book = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();

  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep(step+1);
    window.scrollTo(0,0)
  }

  const handlePrevStep = () => {
    setStep(step-1);
    window.scrollTo(0,0)
  }

  const steps = ['Information', 'Confirm & Pay', 'Done'];

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={4}>
        {step < 3 && (
        <Grid
          item
          container
          alignItems="center"
          xs={12}
          style={{marginBottom: theme.spacing(8)}}
        >
          <HorizontalStepper activeStep={step-1} steps={steps} />
        </Grid>
        )}
        {step === 1 && (
          <Grid
            item
            container
            alignItems="center"
            justify="flex-start"
            xs={12}
            md={6}
            data-aos="fade-up"
          >
            <Grid item>
              <SectionHeader
                title={
                  <>
                    <span>
                      Book {data.name}
                    </span>
                  </>
                }
                subtitle={"Please fill out the following form to book this artist."}
                subtitleProps={{style: { color: theme.palette.text.light }}}
                align="left"
                disableGutter
              />
              <BookForm data={data} onNextStep={handleNextStep} onPrevStep={handlePrevStep} />
            </Grid>
          </Grid>
        )}
        {step === 2 && (
          <Grid
            item
            container
            alignItems="center"
            justify="flex-start"
            xs={12}
            md={6}
            data-aos="fade-up"
          >
            <Grid item>
              <SectionHeader
                title={
                  <>
                    <span>
                      Confirm & Pay
                    </span>
                  </>
                }
                subtitle={"Please confirm event details and provide payment information below."}
                subtitleProps={{style: { color: theme.palette.text.light }}}
                align="left"
                disableGutter
              />
              <BookPayment data={data} onNextStep={handleNextStep} onPrevStep={handlePrevStep} />
            </Grid>
          </Grid>
        )}
        {step === 3 && (
          <Grid
            item
            container
            alignItems="center"
            justify="flex-start"
            xs={12}
            data-aos="fade-up"
          >
            <Grid item xs={12}>
              <SectionHeader
                title={
                  <>
                    <span>
                      Success!
                    </span>
                  </>
                }
                titleProps={{style: { textAlign: 'center' }}}
                subtitle={(
                    <>
                      The details of your event and your confirmation code have been emailed to you.<br/>Please print this page for your records.
                    </>
                  )}
                subtitleProps={{style: { textAlign: 'center', color: theme.palette.text.light }}}
                align="left"
                disableGutter
              />
              <BookReceipt data={data} />
            </Grid>
          </Grid>
        )}
        {step < 3 && (
          <Grid
            item
            container
            justify="flex-end"
            alignItems="center"
            xs={12}
            md={6}
            data-aos="fade-up"
          >
            <CardBooker
              data={data}
              className={classes.cardBooker}
              withShadow
              withPrice
              noButton
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

Book.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to render
   */
  data: PropTypes.object.isRequired,
};

export default Book;
