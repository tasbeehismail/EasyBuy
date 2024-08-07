import AppError from '../utils/appError.js';
import mongoose from 'mongoose';

// Middleware to check if the user is the owner of the document
export const authorizeOwner = (modelName, ownerField, adminAllowed = false) => {
    return async (req, res, next) => {
    // Retrieve document ID from request parameters
    const documentId = req.params.id;

    // Get the model
    const Model = mongoose.models[modelName];

    // Fetch the document from the database
    const document = await Model.findById(documentId);

    // Check if the document exists
    if (!document) {
      return next(new AppError(`${modelName} not found`, 404));
    }

    // Check if the user making the request is the owner of the document or an admin   
    if (document[ownerField].toString() !== req.user.id && (adminAllowed && req.user.role !== 'admin')) {
      return next(new AppError('You are not authorized to perform this action', 403));
    }

    // Proceed to the next if the user is the owner
    next();
  }
};