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

brandSchema.post('init', function (brand) {
  brand.logo = `${process.env.BASE_URL}/uploads/brands/${brand.logo}`
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
