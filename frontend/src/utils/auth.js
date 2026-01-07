// Utility functions for authentication localStorage operations

export const getStoredToken = () => {
  return localStorage.getItem('token');
};

export const getStoredUserId = () => {
  return localStorage.getItem('userId');
};

export const setStoredAuth = (token, userId) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
};

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

export const hasValidStoredAuth = () => {
  const token = getStoredToken();
  const userId = getStoredUserId();
  return !!(token && userId);
};
