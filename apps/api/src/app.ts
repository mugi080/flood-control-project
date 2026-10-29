import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { healthRoutes } from './routes/health.js';
import { floodZoneRoutes } from './routes/flood-zones.js';
import { AppConfig, loadConfig } from './config.js';

export interface BuildAppOptions extends FastifyServerOptions {
  config?: AppConfig;
}

export function buildApp(options: BuildAppOptions = {}): FastifyInstance {
  const config = options.config || loadConfig();

  const app = fastify({
    logger: {
      level: config.nodeEnv === 'test' ? 'silent' : 'info',
    },
    ...options,
  });

  // Register standard sensible HTTP utilities
  app.register(sensible);

  // Configure CORS
  app.register(cors, {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Register application routes
  app.register(healthRoutes);
  app.register(floodZoneRoutes);

  // Custom 404 handler with structured response
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Cannot ${request.method} ${request.url}`,
      timestamp: new Date().toISOString(),
    });
  });

  // Structured global error handler
  app.setErrorHandler((error, _request, reply) => {
    const statusCode = error.statusCode || 500;

    app.log.error(error);

    if (error.validation) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Request validation failed',
        details: error.validation,
        timestamp: new Date().toISOString(),
      });
    }

    return reply.code(statusCode).send({
      statusCode,
      error: error.name || 'Internal Server Error',
      message: statusCode === 500 && config.nodeEnv === 'production'
        ? 'An unexpected internal error occurred'
        : error.message,
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
