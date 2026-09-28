import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../config/logger.js';
import { AppError } from './app.error.js';

export const errorHandler = (
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void => {
  const logContext = {
    requestId: request.id,
    method: request.method,
    url: request.url,
  };

  if (error instanceof AppError) {
    logger.warn(
      {
        ...logContext,
        statusCode: error.statusCode,
        errorName: error.name,
        message: error.message,
      },
      'Application error',
    );

    void reply.code(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    });

    return;
  }

  if ('validation' in error && error.validation) {
    logger.warn(
      {
        ...logContext,
        statusCode: 400,
        errorName: 'ValidationError',
        message: error.message,
      },
      'Request validation error',
    );

    void reply.code(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: error.message,
    });

    return;
  }

  logger.error(
    {
      ...logContext,
      statusCode: 500,
      errorName: error.name,
      message: error.message,
      stack: error.stack,
    },
    'Unhandled application error',
  );

  void reply.code(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
};
