import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

export const AppContext = React.createContext();
export const useApp = () => useContext(AppContext);

const pages = [
  {
    title: 'Home',
    id: 'home',
    href: '/home',
    primary: true,
  },
  {
    title: 'Browse',
    id: 'browse',
    href: '/browse',
    primary: true,
  },
  {
    title: 'About',
    id: 'about',
    href: '/about',
    primary: true,
  },
  {
    title: 'Help',
    id: 'help',
    href: '/help',
    primary: true,
  },
  {
    title: 'Documentation',
    id: 'documentation',
    href: '/documentation',
    primary: true,
  },
  {
    title: 'Privacy',
    id: 'privacy',
    href: '/privacy',
  },
  {
    title: 'Terms',
    id: 'terms',
    href: '/terms',
  },
];

const durations = [
  { name: '10 mins', value: 10 },
  { name: '20 mins', value: 20 },
  { name: '30 mins', value: 30 },
  { name: '40 mins', value: 40 },
  { name: '50 mins', value: 50 },
  { name: '1 hr', value: 60 },
  { name: '1 hr 10 mins', value: 70 },
  { name: '1 hr 20 mins', value: 80 },
  { name: '1 hr 30 mins', value: 90 },
  { name: '1 hr 40 mins', value: 100 },
  { name: '1 hr 50 mins', value: 110 },
  { name: '2 hrs', value: 120 },
  { name: '2 hrs 10 mins', value: 130 },
  { name: '2 hrs 20 mins', value: 140 },
  { name: '2 hrs 30 mins', value: 150 },
  { name: '2 hrs 40 mins', value: 160 },
  { name: '2 hrs 50 mins', value: 170 },
  { name: '3 hrs', value: 180 },
];

const defaultFilterValues = {
  location: null,
  artistType: null,
  date: null,
  artistGenre: null,
};

const defaultBookFormValues = {
  firstname: '',
  lastname: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipcode: '',
  eventStyle: '',
  songRequests: '',
  specialRequests: '',
  zoomMeetingId: '',
  zoomMeetingPasscode: '',
  bookDate: null,
  bookTime: null,
  bookDuration: durations[2],
  feeDuration: 0,
  feeService: 0,
  feeTotal: 0,
  termsAccepted: false,
  confNum: '',
  ccLast4: '',
  ccBrand: '',
  ccReceiptUrl: '',
  ccReceiptNumber: '',
};

const settings = {
  serviceFeePercentage: 0.12,
  company_name: 'MUZE Music, Inc',
  domain: 'muzebeta.com',
  full_address: '9A Monument Square, Charlestown, MA 02129',
  address: '9A Monument Square',
  city: 'Charlestown',
  state: 'MA',
  zip: '02129',
  email: 'info@muzebeta.com',
  phone: '617-842-4669',
};

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLoading, setSearchResultsLoading] = useState(true);

  const [data, setData] = useState({
    pages: pages,
    locations: [],
    artistTypes: [],
    artistGenres: [],
  });

  const appQuery = useQuery('appData', async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/app/hydrate`);
    return data;
  });

  useEffect(() => {
    if (appQuery.data) {
      setData((prevState) => {
        let newState = Object.assign({}, prevState, appQuery.data);
        return newState;
      });
      setLoading(false);
    }
  }, [appQuery.data]);

  const [filterValues, setFilterValues] = useState(defaultFilterValues);

  const handleFilterValuesChange = (event) => {
    const { name, value } = event.target;
    setFilterValues((prevState) => {
      let newValues = { ...prevState };
      newValues[name] = value;
      return newValues;
    });
  };

  const [bookFormValues, setBookFormValues] = useState(defaultBookFormValues);

  const handleBookFormValuesChange = (event) => {
    const { name, value } = event.target;

    setBookFormValues((prevState) => {
      let newValues = { ...prevState };
      newValues[name] = value;
      return newValues;
    });
  };

  const handleResetBookFormValues = () => {
    setBookFormValues(defaultBookFormValues);
  };

  const handleSetCompleteBookFormValues = (newBookFormValues) => {
    setBookFormValues(newBookFormValues);
  };

  const doSearch = async (paramFilterValues) => {
    let myFilterValues = { ...paramFilterValues };
    if (!paramFilterValues) myFilterValues = { ...filterValues };

    setSearchResultsLoading(true);
    const { data } = await axios.post(`${process.env.REACT_APP_ENDPOINT}/api/search`, myFilterValues);
    setSearchResults(data);
    setSearchResultsLoading(false);
  };

  const handleSearch = (locationId, artistTypeId, artistGenreId) => {
    if (locationId || artistTypeId || artistGenreId) {
      const paramFilterValues = { ...filterValues };
      if (artistTypeId) {
        setFilterValues((prevState) => {
          const newValues = { ...prevState };
          newValues['artistType'] = data.artistTypes.find(x => x.id === parseInt(artistTypeId));
          return newValues;
        });
      }
      if (artistGenreId) {
        setFilterValues((prevState) => {
          const newValues = { ...prevState };
          newValues['artistGenre'] = data.artistGenres.find(x => x.id === parseInt(artistGenreId));
          return newValues;
        });
      }
      if (locationId) {
        setFilterValues((prevState) => {
          const newValues = { ...prevState };
          newValues['location'] = data.locations.find(x => x.id === parseInt(locationId));
          return newValues;
        });
      }
      paramFilterValues['artistType'] = data.artistTypes.find(x => x.id === parseInt(artistTypeId));
      paramFilterValues['artistGenre'] = data.artistGenres.find(x => x.id === parseInt(artistGenreId));
      paramFilterValues['location'] = data.locations.find(x => x.id === parseInt(locationId));
      doSearch(paramFilterValues);
    } else {
      doSearch();
    }
  };

  const handleSearchAll = async () => {
    setFilterValues(defaultFilterValues);
    await doSearch(defaultFilterValues);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        loading,
        setLoading,
        filterValues,
        setFilterValues,
        bookFormValues,
        searchResults,
        searchResultsLoading,
        durations,
        settings,
        handleFilterValuesChange,
        handleBookFormValuesChange,
        handleResetBookFormValues,
        handleSetCompleteBookFormValues,
        handleSearch,
        doSearch,
        handleSearchAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
