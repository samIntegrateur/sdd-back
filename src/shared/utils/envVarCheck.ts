
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
  'TOKEN_SECRET',
  'TOKEN_NAME',
  'AWS_S3_ID',
  'AWS_S3_SECRET',
  'AWS_S3_BUCKET',
  'AWS_S3_REGION',
];

export const envVarCheck = (envVarsProvided: { [key: string]: string | undefined }) => {
  envVarList.forEach(envVar => {
    if (!envVarsProvided[envVar]) {
      console.warn(`[WARNING] Environment variable "${[envVar]}" is undefined. This may cause critical errors. Have you defined it in an .env file ?`);
    }
  });
};
