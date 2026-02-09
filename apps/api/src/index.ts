import { createServer } from './server';
import { initRedis, closeRedis } from './services/redis';
import { logger } from './lib/logger';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  try {
    // Try to initialize Redis connection (non-blocking, optional)
    const redisConnected = await initRedis();
    if (redisConnected) {
      logger.info('Redis initialized successfully');
    } else {
      logger.info('Redis not available - application will run without caching');
    }

    // Create and start Express server
    const app = createServer();
    const server = app.listen(port, () => {
      logger.info(`API listening on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully');
      server.close(async () => {
        await closeRedis();
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
