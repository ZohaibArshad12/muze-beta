import React, { useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';
import axios from 'axios';
import { useApp } from 'AppProvider';
import { goTo } from 'utils';

const useStyles = makeStyles(theme => ({
  root: {},
  formContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
    maxWidth: 500,
    margin: `0 auto`,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  label: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}));

const ZoomRedirect = props => {
  const { history } = props;
  const location = useLocation();
  const classes = useStyles();
  const app = useApp();


  const createZoomMeeting = async code => {
    try {

      let localstorageFormState = localStorage.getItem('book-artist-form-state');
      if (true || localstorageFormState) {
        localstorageFormState = JSON.parse(localstorageFormState);

        const zoomAuthRes = await axios.post(`${process.env.REACT_APP_ENDPOINT}/api/app/zoomAuthorize`, {
          code
        },{withCredentials: true});

        localStorage.setItem('zoom-token', zoomAuthRes.data.zoomToken );
        app.handleSetCompleteBookFormValues({ ...localstorageFormState })
        const userURLBeforeRedirect = localStorage.getItem('url-before-redirect');

        localStorage.removeItem('book-artist-form-state')
        localStorage.removeItem('url-before-redirect');
        goTo(history, userURLBeforeRedirect);
      } else {
        goTo(history, '');
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    debugger
    const locationSearch = location.search;
    let code = locationSearch.split('?')[1];
    if (code && code.includes('code')) {
      code = code.split('code=')[1];
      if (code) {
        createZoomMeeting(code);
      } else {
        goTo(history, '');
      }
    } else {
      goTo(history, '');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
          <SectionHeader
            label=""
            title=""
            subtitle={<span>Authorizing with zoom.</span>}
            titleProps={{
              variant: 'h3',
            }}
            labelProps={{
              color: 'secondary',
              className: classes.label,
              variant: 'h5',
            }}
            disableGutter
          />
        </div>
      </Section>
    </div>
  );
};

export default withRouter(ZoomRedirect);
