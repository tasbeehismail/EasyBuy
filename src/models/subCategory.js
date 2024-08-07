import {mongoose, Types} from 'mongoose';
import AppError from '../utils/appError.js';

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  Category: {
    type: Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  updatedBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {timestamps: true});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;
