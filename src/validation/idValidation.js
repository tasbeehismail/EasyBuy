import AppError from '../utils/appError.js';

/**
 * Validates if the ID is a valid hexadecimal string of length 24.
 * Custom validation function.
 *
 * @param {string} id - The ID to validate.
 * @returns {string} - Returns the validated ID if valid, throws an AppError otherwise.
 */
export const isValidId = () => {
    return (req, res, next) => {
        const id = req.params.id || req.params.categoryId || req.body.product;
        if(!id) return next();
        // Check if ID is a string and has a length of 24 characters
        if (typeof id !== 'string' || id.length !== 24) {
            next(new AppError('Validation error', 400, 
                [{field: "id", message: "ID must be a string of 24 characters" }]
            ));
        }

        // Check if ID is a valid hexadecimal string
        const isValidHex = /^[0-9a-fA-F]{24}$/.test(id);
        if (!isValidHex) {
            next(new AppError('Validation error', 400,
                [{field: "id", message: "ID must be a valid hexadecimal string" }]
            ));
        }
        next();
    };
}

