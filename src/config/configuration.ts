import { AppEnvironment } from './env.schema';

export const configuration = (env: AppEnvironment) => ({
  app: {
    environment: env.NODE_ENV,
    port: env.PORT,
    serviceName: env.SERVICE_NAME,
    apiPrefix: env.API_PREFIX,
    corsOrigins: env.CORS_ORIGINS,
    logLevel: env.LOG_LEVEL,
  },
});
