import { buildApp } from './app.js';
import { loadConfig } from './config.js';

async function startServer() {
  const config = loadConfig();
  const app = buildApp({ config });

  try {
    const address = await app.listen({
      port: config.port,
      host: config.host,
    });

    app.log.info(`[FloodControl API] Service successfully listening on ${address}`);
    app.log.info(`[FloodControl API] Health probe ready at ${address}/health`);
    app.log.info(`[FloodControl API] Demonstration zones available at ${address}/api/v1/flood-zones`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  const closeGracefully = async (signal: string) => {
    app.log.info(`Received ${signal}. Shutting down Fastify server gracefully...`);
    try {
      await app.close();
      app.log.info('Fastify server closed cleanly.');
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, 'Error during Fastify shutdown');
      process.exit(1);
    }
  };

  process.on('SIGINT', () => closeGracefully('SIGINT'));
  process.on('SIGTERM', () => closeGracefully('SIGTERM'));
}

startServer();
