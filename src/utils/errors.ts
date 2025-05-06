class NotFoundError extends Error {
  status: number;

  constructor(message: string = "Data Not Found", status: number = 404) {
    super(message);
    this.name = "NotFoundError";
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class UnauthorizedError extends Error {
  status: number;

  constructor(message: string = "Unauthorized", status: number = 401) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class PermissionDeniedError extends Error {
  status: number;

  constructor(message: string = "Permission Denied", status: number = 403) {
    super(message);
    this.name = "PermissionDeniedError";
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends Error {
  status: number;

  constructor(message: string = "Validation Error", status: number = 400) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class InternalServerError extends Error {
  status: number;

  constructor(message: string = "Internal Server Error", status: number = 500) {
    super(message);
    this.name = "ServerError";
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export {
  NotFoundError,
  UnauthorizedError,
  PermissionDeniedError,
  ValidationError,
  InternalServerError,
};
