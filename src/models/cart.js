import {mongoose, Types} from 'mongoose';

const cartProductSchema = new mongoose.Schema({
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

const cartSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [cartProductSchema],    
  total: { // total price without discount
    type: Number,
    required: true,
    min: 0,
  }
}, {timestamps: true});


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
