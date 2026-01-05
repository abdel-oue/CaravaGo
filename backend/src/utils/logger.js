// Backend logging utility
export const logger = {
  error: (message, data = null, error = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [BACK] [ERROR] ${message}`);
    if (data) console.log('Data:', data);
    if (error) console.log('Error details:', error);
  },

  success: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [BACK] [SUCCESS] ${message}`, data ? { data } : '');
  },

  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [BACK] [INFO] ${message}`, data ? { data } : '');
  },

  warning: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [BACK] [WARNING] ${message}`, data ? { data } : '');
  }
};

// Database logging
export const dbLogger = {
  error: (message, data = null, error = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [DB] [ERROR] ${message}`);
    if (data) console.log('Query data:', data);
    if (error) console.log('Database error:', error);
  },

  success: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [DB] [SUCCESS] ${message}`, data ? { data } : '');
  },

  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [DB] [INFO] ${message}`, data ? { data } : '');
  },

  warning: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [DB] [WARNING] ${message}`, data ? { data } : '');
  }
};

// Authentication logging
export const authLogger = {
  error: (message, data = null, error = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [AUTH] [ERROR] ${message}`);
    if (data) console.log('Auth data:', { ...data, password: '[REDACTED]' });
    if (error) console.log('Auth error:', error);
  },

  success: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [AUTH] [SUCCESS] ${message}`, data ? { ...data, password: '[REDACTED]' } : '');
  },

  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [AUTH] [INFO] ${message}`, data ? { ...data, password: '[REDACTED]' } : '');
  },

  warning: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [AUTH] [WARNING] ${message}`, data ? { ...data, password: '[REDACTED]' } : '');
  }
};
