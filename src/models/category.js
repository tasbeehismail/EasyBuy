import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: true,
  }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
