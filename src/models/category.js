import mongoose, {Types} from 'mongoose';
import AppError from '../utils/appError.js';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50,
    set: (value) => value.replace(/\s+/g, ' ').trim(),
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
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

categorySchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new AppError('Category with this name already exists.', 409));
  } else {
      next(error);
  }
});
categorySchema.post('init', function (category) {
  category.image = `${process.env.BASE_URL}/uploads/${category.image}`
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
