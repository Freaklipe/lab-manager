import {
  DuplicateResourceError,
  ResourceConflictError,
} from './app.error.js';

export const mapPostgresError = (error: unknown): unknown => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    if (error.code === '23505') {
      return new DuplicateResourceError(
        'A resource with the same unique value already exists',
      );
    }

    if (error.code === '23503') {
      return new ResourceConflictError(
        'The operation conflicts with an existing resource',
      );
    }

    if (error.code === '23001') {
      return new ResourceConflictError(
        'The operation conflicts with an existing resource',
      );
    }
  }

  return error;
};
