import pino from 'pino';
import type { FastifyLoggerOptions } from 'fastify';
import { config } from './env.js';

const { level } = config.logger;

export const loggerConfig: FastifyLoggerOptions = {
  level,
};

export const logger = pino({
  level,
});
