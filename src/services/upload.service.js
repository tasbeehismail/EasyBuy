import multer from 'multer';
import { storage, fileFilter } from '../config/fileStorage.js';

/**
 * Handle mixed file uploads.
 *
 * @param {Array} fieldsConfig - The configuration for the fields.
 * @return {Function} The middleware function that will handle file uploads.
 */
const uploadMixOfFiles = (fieldsConfig) => {
  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
      if (fieldsConfig.find(field => field.name === file.fieldname)) {
        fileFilter(file.fieldname)(req, file, cb);
      } else {
        cb(new AppError(`Unexpected field ${file.fieldname}`, 400), false);
      }
    }
  }).fields(fieldsConfig);
};

const uploadSingleFile = (fieldName) => multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(fieldName)
}).single(fieldName);

const uploadManyFiles = (fieldName) => multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(fieldName)
}).array(fieldName, 10);

export { uploadSingleFile, uploadManyFiles, uploadMixOfFiles };
