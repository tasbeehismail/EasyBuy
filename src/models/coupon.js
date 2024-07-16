import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  expiryDate: {
    type: Date,
  },
  usageCount: {
    type: Number,
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
