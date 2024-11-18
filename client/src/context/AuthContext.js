import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const AuthContext = createContext({
  authToken: null,
  userDetails: {},
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem('token'); // Get the token a single time
  const [authToken, setAuthToken] = useState(initialToken);

  const [userDetails, setUserDetails] = useState(() => {
    try {
      return initialToken ? jwtDecode(initialToken) : {}; // Decode the stored token to set initial user details
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {};
    }
  });

  const login = useCallback((token) => {
    if (token !== authToken) {  // Use authToken from state to avoid redundant set
      console.log("Logging in, updating token and user details");
      localStorage.setItem('token', token);
      setAuthToken(token);
      try {
        const decoded = jwtDecode(token);
        setUserDetails(decoded);
        console.log("User details updated:", decoded);
      } catch (error) {
        console.error('Failed to decode token on login:', error);
        setUserDetails({});
      }
    }
  }, [authToken]);  // Include authToken in the dependency array

  const logout = useCallback(() => {
    console.log("Logging out, clearing token and user details");
    localStorage.removeItem('token');
    setAuthToken(null);
    setUserDetails({});
  }, []);

  const providerValue = useMemo(() => ({
    authToken,
    userDetails,
    login,
    logout
  }), [authToken, userDetails, login, logout]);

  useEffect(() => {
    console.log('AuthProvider rendered or context value changed');
  }, [providerValue]);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
