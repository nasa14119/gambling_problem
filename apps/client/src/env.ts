const env = import.meta.env

export const WS_URL = import.meta.env.PROD
  ? env.VITE_WS_URL
  : env.VITE_WS_DEV_URL
export const SERVER_PATH = import.meta.env.PROD
  ? env.VITE_SERVER
  : env.VITE_DEV_SERVER
