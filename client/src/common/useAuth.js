export const useAuth = () => {
  const token = localStorage.getItem('access_token');
    if (token) {
      return true;
    } else {
      return false;
    }
}

export const getToken = () => {
  const token = localStorage.getItem('access_token');
    if (token) {
      return token;
    } else {
      return false;
    }
}