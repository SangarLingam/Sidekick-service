import { z } from 'zod';

const csv = (fallback: string) =>
  z.string().default(fallback).transform((value) =>
    value.split(',').map((entry) => entry.trim()).filter(Boolean),
  );

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  SERVICE_NAME: z.string().min(1).default('sidekick-service'),
  API_PREFIX: z.string().regex(/^[a-zA-Z0-9/_-]+$/).default('api/v1'),
  CORS_ORIGINS: csv('http://localhost:3001,http://localhost:3002'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type AppEnvironment = z.infer<typeof envSchema>;
