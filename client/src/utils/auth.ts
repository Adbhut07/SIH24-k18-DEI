
import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  return Cookies.get('jwt') ? true : false;
};