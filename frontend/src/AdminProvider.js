import React, { useState, useContext } from 'react';

export const AdminContext = React.createContext();
export const useAdmin = () => useContext(AdminContext);

const pages = [
  /*{
    title: 'Manage Data',
    id: 'manage-data',
    href: '/admin',
    primary: true,
  },*/
];

export const AdminProvider = ({ children }) => {

  const [data] = useState({
    pages: pages,
  });

  return (
    <AdminContext.Provider
      value={{
        data,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};