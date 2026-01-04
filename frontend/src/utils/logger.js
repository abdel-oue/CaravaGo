// Frontend logging utility
export const logger = {
  error: (message, data = null) => {
    console.log(`[FRONT] [ERROR] ${message}`, data ? { data } : '');
  },

  success: (message, data = null) => {
    console.log(`[FRONT] [SUCCESS] ${message}`, data ? { data } : '');
  },

  info: (message, data = null) => {
    console.log(`[FRONT] [INFO] ${message}`, data ? { data } : '');
  },

  warning: (message, data = null) => {
    console.log(`[FRONT] [WARNING] ${message}`, data ? { data } : '');
  }
};
