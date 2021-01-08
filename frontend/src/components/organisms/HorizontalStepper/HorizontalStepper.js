import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Step, StepLabel, Stepper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& .MuiPaper-root': {
      backgroundColor: 'transparent',
    },
  },
}));

const HorizontalStepper = props => {
  const { steps, activeStep } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default HorizontalStepper;