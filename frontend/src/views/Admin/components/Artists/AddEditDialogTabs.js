import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CreateIcon from '@material-ui/icons/Create';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import GradeIcon from '@material-ui/icons/Grade';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: 892,
    '& .MuiTab-textColorSecondary': {
      color: theme.palette.text.light,
    },
    '& .MuiTab-textColorSecondary.Mui-selected': {
      color: theme.palette.text.secondary,
    },
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.text.secondary,
    },
  },
}));

export default function IconLabelTabs(props) {
  const { mode, onChange, className, ...rest } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(event, newValue);
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
      >
        <Tab icon={<CreateIcon />} label="Data" />
        <Tab icon={<PhotoLibraryIcon />} label="Images" />
        {mode === 'edit' && (
            <Tab icon={<AttachMoneyIcon />} label="Bookings" />
        )}
        {mode === 'edit' && (
          <Tab icon={<GradeIcon />} label="Reviews" />
        )}
      </Tabs>
    </div>
  );
}