import multer from 'multer';
import { v4 as uuid } from 'uuid';
import AppError from '../utils/appError.js';
import fs from 'fs';
import path from 'path';

/**
 * Ensure directory exists or create it.
 *
 * @param {string} dirPath - The directory path.
 */
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
/**
 * Multer storage configuration with dynamic folder creation.
 */
const storage = multer.diskStorage({
// Set the destination path where the files will be stored
  // Parameters:
  // - req: the request object
  // - file: the file being uploaded
  // - cb: the callback function
  destination: (req, file, cb) => {
    const module = req.baseUrl.split('/').pop();
    const dirPath = path.join('uploads', module);
    ensureDirectoryExistence(dirPath);
    cb(null, dirPath);
  },
  /**
   * Set the filename for the uploaded file.
   *
   * @param {Object} req - The request object.
   * @param {Object} file - The file being uploaded.
   * @param {Function} cb - The callback function.
   * @return {void}
   */
  filename: (req, file, cb) => {
    // Generate a unique identifier and append the original filename to create the new filename.
    cb(null, uuid() + '-' + file.originalname);
  }
});

/**
 * Checks the mime type of the uploaded file and validates it.
 *
 * @param {String} fieldName - The name of the field for the file input.
 * @return {Function} The middleware function that will be called by multer.
 */
const fileFilter = (fieldName) => {
  return (req, file, cb) => {
    // Check if the mime type of the uploaded file starts with '???'
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      // If the mime type is not valid, return an error
      cb(new AppError(`Not a valid ${fieldName}! Please upload only ${fieldName}.`, 400), false);
    }
  };
};

export { storage, fileFilter };
