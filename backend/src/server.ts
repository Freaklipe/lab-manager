import { config } from './config/env.js';
import { checkDatabaseConnection } from './database/connection.js';
import { server } from './app.js';


const { host, port } = config.server;

const start = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();
    server.log.info('PostgreSQL connection successful');

    await server.listen({
      port,
      host,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
