import AppError from '../utils/appError.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';

export const createCashOrder = async (req, res, next) => { // checkout
    const user = req.user._id;
    const { cartId } = req.params;
    const { shippingAddress } = req.body;
    
    // find cart by id
    const userCart = await Cart.findById(cartId);
    if (!userCart) {
        return next(new AppError('Cart not found', 404));
    }

    // get products from cart
    let products = userCart.items;

    // create order 
    const order = await Order.create({ 
        user, 
        products, 
        total_price: userCart.total, // after applying coupon 
        shippingAddress, 
        paymentMethod: 'cash', 
        status: 'shipped'
    });

    // update stock and sold
    Product.bulkWrite(
        products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: -item.quantity, sold: item.quantity } },
                },
            };
        })
    );

    // delete cart
    if (userCart) {
        await Cart.findByIdAndDelete(cartId);
    }

    // populate user data
    await order.populate({ path: 'user', select: 'firstName lastName email' });

    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
}

