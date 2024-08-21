import {mongoose, Schema, Types} from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
  },
  category: {
    type: Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  subCategory: {
    type: Types.ObjectId,
    ref: 'SubCategory',
  },
  brand: {
    type: Types.ObjectId,
    required: true,
    ref: 'Brand',
  },
  images: [{
    type: String,
    required: true,
  }],
  coverImage: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  sold: {
    type: Number,
    default: 0,
    min: 0,
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numRatings: {
    type: Number,
    default: 0,
    min: 0,
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
});

productSchema.post('init', function (product) {
  if (product.coverImage) {
    product.coverImage = `${process.env.BASE_URL}/uploads/products/${product.coverImage}`;
  }
  if (product.images) {
    product.images = product.images.map(image => `${process.env.BASE_URL}/uploads/products/${image}`);
  }
});

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Custom query helper to skip populating reviews
productSchema.query.skipPopulateReviews = function () {
  this._skipPopulateReviews = true;
  return this;
};

productSchema.pre(/^find/, function (next) {
  if (!this._skipPopulateReviews) {
    this.populate({
      path: 'reviews',
      select: 'comment rating',
    });
  }
  next();
});

productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
