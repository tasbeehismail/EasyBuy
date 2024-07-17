import mongoose, {Types} from 'mongoose';
import AppError from '../utils/appError.js';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minLength: 2,
    maxLength: 50,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  logo: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  updatedBy:{
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {timestamps: true});

brandSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new AppError('Brand with this name already exists.', 409));
  } else {
      next(error);
  }
});
brandSchema.post('init', function (brand) {
  brand.logo = `${process.env.BASE_URL}/uploads/${brand.logo}`
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
