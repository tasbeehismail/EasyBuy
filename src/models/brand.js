import mongoose, {Types} from 'mongoose';

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

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
