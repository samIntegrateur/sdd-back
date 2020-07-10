
// Check the required environment variables and log a clear message if missing,
const envVarList = [
  'NODE_ENV',
  'MONGO_USER',
  'MONGO_PASSWORD',
  'MONGO_HOST',
  'MONGO_DB',
  'DOMAIN',
  'PORT',
  'FRONT_URL',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'AUTH_TOKEN_COOKIE_NAME',
];

export const envVarCheck = (envVarsProvided: { [key: string]: string | undefined }) => {
  envVarList.forEach(envVar => {
    if (!envVarsProvided[envVar]) {
      console.warn(`[WARNING] Environment variable "${[envVar]}" is undefined. This may cause critical errors. Have you defined it in an .env file ?`);
    }
  });
};
