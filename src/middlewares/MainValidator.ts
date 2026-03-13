import { validationResult, ValidationError, FieldValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const formatErrors = (error: ValidationError) => ({
    field: (error as FieldValidationError).path,
    message: error.msg,
});

export const inputValidationResultMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });

    if (errors.length) {
        return res.status(400).json({ errorMessages: errors });
    }

    next();
};