import {
  DatabaseError,
  DuplicateResourceError,
  ResourceConflictError,
} from './app.error.js';

interface PostgresError {
  code: string;
  severity: string;
}

const isPostgresError = (error: unknown): error is PostgresError => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  if (!('code' in error) || !('severity' in error)) {
    return false;
  }

  return (
    typeof error.code === 'string' &&
    error.code.length === 5 &&
    typeof error.severity === 'string'
  );
};

export const mapPostgresError = (error: unknown): unknown => {
  if (!isPostgresError(error)) {
    return error;
  }

  if (error.code === '23505') {
    return new DuplicateResourceError(
      'A resource with the same unique value already exists',
    );
  }

  if (error.code === '23503' || error.code === '23001') {
    return new ResourceConflictError(
      'The operation conflicts with an existing resource',
    );
  }

  return new DatabaseError();
};
