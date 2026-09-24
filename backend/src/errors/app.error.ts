export class AppError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export class DuplicateResourceError extends AppError {
  constructor(message: string) {
    super(message, 409);

    this.name = 'DuplicateResourceError';
  }
}

export class ResourceConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);

    this.name = 'ResourceConflictError';
  }
}
