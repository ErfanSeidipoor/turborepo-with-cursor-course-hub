import { HttpException, HttpStatus } from '@nestjs/common';

export interface ICustomError {
  status: HttpStatus;
  description: string;
}

export class CustomError extends HttpException {
  constructor({ description, status }: ICustomError) {
    super(description, status);
  }

  static fromError(error: Error, status?: HttpStatus): CustomError {
    return new CustomError({
      status: status || HttpStatus.INTERNAL_SERVER_ERROR,
      description: error.message,
    });
  }
}

// ============================================================================
// USER ERRORS
// ============================================================================

export const USER_NOT_FOUND: ICustomError = {
  status: HttpStatus.NOT_FOUND,
  description: 'User Not Found',
};

export const USER_USERNAME_ALREADY_EXISTS: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'User With This Username Already Exists',
};

export const INVALID_CREDENTIALS: ICustomError = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Invalid Credentials',
};

export const INVALID_CURRENT_PASSWORD: ICustomError = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Invalid Current Password',
};

export const USER_USERNAME_REQUIRED: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Username Is Required',
};

export const USER_PASSWORD_REQUIRED: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Password Is Required',
};

export const USER_USERNAME_EMPTY: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Username Cannot Be Empty',
};

export const USER_PASSWORD_EMPTY: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Password Cannot Be Empty',
};

// ============================================================================
// TAG ERRORS
// ============================================================================

export const TAG_NOT_FOUND: ICustomError = {
  status: HttpStatus.NOT_FOUND,
  description: 'Tag Not Found',
};

// ============================================================================
// ACTIVITY ERRORS
// ============================================================================

export const ACTIVITY_NOT_FOUND: ICustomError = {
  status: HttpStatus.NOT_FOUND,
  description: 'Activity Not Found',
};

export const ACTIVITY_SLUG_ALREADY_EXISTS: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Activity With This Slug Already Exists',
};

export const ACTIVITY_TITLE_REQUIRED: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Activity Title Is Required',
};

export const ACTIVITY_SLUG_REQUIRED: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Activity Slug Is Required',
};

export const ACTIVITY_AGE_RANGE_REQUIRED: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'At Least One Age Range Must Be Specified',
};

export const ACTIVITY_TYPE_REQUIRED: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Activity Type Is Required',
};

export const ACTIVITY_CREATED_BY_REQUIRED: ICustomError = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Activity Creator Is Required',
};
