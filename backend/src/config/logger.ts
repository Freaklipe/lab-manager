import pino from 'pino';
import type { FastifyLoggerOptions } from 'fastify';

const logLevel = process.env.LOG_LEVEL ?? 'info';

export const loggerConfig: FastifyLoggerOptions = {
  level: logLevel,
};

export const logger = pino({
  level: logLevel,
});
