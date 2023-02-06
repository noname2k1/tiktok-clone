import React from 'react';
const authModalContext = React.createContext();
const useAuthModalContext = () => React.useContext(authModalContext);

export { authModalContext, useAuthModalContext };
