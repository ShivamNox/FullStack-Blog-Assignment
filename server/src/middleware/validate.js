import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const details = errors.array().map((err) => ({
      field: err.path,
      message: err.msg
    }));

    next(new ApiError(400, 'Validation failed', details));
  };
};

export default validate;