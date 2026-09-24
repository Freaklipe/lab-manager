import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './app.error.js';

export const errorHandler = (
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
): void => {
  if (error instanceof AppError) {
    void reply.code(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    });

    return;
  }

  if ('validation' in error && error.validation) {
    void reply.code(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: error.message,
    });

    return;
  }

  void reply.code(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
};
