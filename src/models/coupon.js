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
    required: true,
  },
  maxUsageCount: {
    type: Number,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }
}, {timestamps: true});

// Middleware to delete expired coupons before a query
couponSchema.pre(/^find/, async function (next) {
  await Coupon.deleteMany({ expiryDate: { $lt: new Date() } });
  await Coupon.deleteMany({ usedCount: { $gte: this.maxUsageCount } });
  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
