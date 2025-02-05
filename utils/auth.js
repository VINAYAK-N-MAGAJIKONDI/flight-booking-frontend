// utils/auth.js
import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  const token = Cookies.get('token');
  return token ? true : false;
};

export const logout = () => {
  Cookies.remove('token');
};
