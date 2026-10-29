import dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config();

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: 'development' | 'production' | 'test';
  corsOrigin: string | string[];
}

export function loadConfig(): AppConfig {
  const port = parseInt(process.env.PORT || '4000', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT configuration: "${process.env.PORT}". Must be between 1 and 65535.`);
  }

  const host = process.env.HOST || '0.0.0.0';
  const nodeEnv = (process.env.NODE_ENV as AppConfig['nodeEnv']) || 'development';
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

  return {
    port,
    host,
    nodeEnv,
    corsOrigin,
  };
}
