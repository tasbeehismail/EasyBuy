import {mongoose, Types} from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
