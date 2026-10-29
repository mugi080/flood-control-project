import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { HealthResponse } from '@flood-control/shared';

const healthSchema = {
  description: 'Application liveness and readiness probe',
  tags: ['Health'],
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        service: { type: 'string' },
        version: { type: 'string' },
        timestamp: { type: 'string' },
        uptimeSeconds: { type: 'number' },
        environment: { type: 'string' },
      },
      required: ['status', 'service', 'version', 'timestamp', 'uptimeSeconds', 'environment'],
    },
  },
};

export const healthRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get<{ Reply: HealthResponse }>(
    '/health',
    { schema: healthSchema },
    async (_request, reply) => {
      const response: HealthResponse = {
        status: 'ok',
        service: 'flood-control-api',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
      };

      return reply.code(200).send(response);
    }
  );
};
