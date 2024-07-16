// models/subCategory.js
import mongoose from 'mongoose';

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
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;
