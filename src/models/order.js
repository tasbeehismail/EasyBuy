import {mongoose, Types} from 'mongoose';

const orderProductSchema = new mongoose.Schema({
  product: {
    type: Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  products: [orderProductSchema],
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
