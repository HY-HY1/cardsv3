export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);

    this.name = this.constructor.name; 
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends Error {
  statusCode: Number;

  constructor(message="Invalid Input") {
    super(message)
    this.name = "Validation Error"
    this.statusCode = 400

    Error.captureStackTrace(this, this.constructor)
  }
}