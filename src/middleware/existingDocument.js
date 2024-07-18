import mongoose from 'mongoose';
import AppError from '../utils/appError.js';

/**
 * Middleware to check if a document with the given fields already exists in the specified module's collection.
 * If a document exists, an AppError is thrown with a 409 status code.
 * If no document exists, the middleware calls the next middleware function in the stack.
 *
 * @param {string} moduleName - The name of the module (e.g., 'user').
 * @param {Array} fields - The fields to check for existence (e.g., ['email', 'mobileNumber']).
 * @returns {Function} The middleware function.
 * @throws {AppError} If a document with the given fields already exists.
 */
export const existingDocument = (moduleName, fields) => {
  return async (req, res, next) => {
    // Get the model dynamically based on moduleName
    const Model = mongoose.model(moduleName);

    // Build the query object dynamically based on the fields provided
    const query = {};
    fields.forEach(field => {
      if (req.body[field]) {
        query[field] = req.body[field];
      }
    });

    // If no fields are provided, proceed to the next middleware
    if (Object.keys(query).length === 0) {
      return next();
    }

    // Find a document with the given fields
    const document = await Model.findOne({ $or: [query] });

    if (document) {
      return next(new AppError(`${moduleName} already exists with these fields: ${fields.join(', ')}`, 409));
    } else {
      next();
    }
  };
};