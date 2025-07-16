export const ENVIRONMENT = {
  dev: import.meta.env.VITE_APP_ENV === 'development',
  staging: import.meta.env.VITE_APP_ENV === 'staging',
  production: import.meta.env.VITE_APP_ENV === 'production',
};
