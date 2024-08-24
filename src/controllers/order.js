import AppError from '../utils/appError.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = async (req, res, next) => {
    const { cartId } = req.params;
    const { shippingAddress } = req.body;

    let userCart = await Cart.findById(cartId);
    if (!userCart) {
        return next(new AppError('Cart not found', 404));
    }

    let session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: 'egp',
                unit_amount: userCart.total * 100,
                product_data: {
                    name: 'Cart Total Payment',
                },
            },
            quantity: 1
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/v1/api/orders/',
        cancel_url: 'http://localhost:3000/v1/api/carts/',
        customer_email: req.user.email,
        client_reference_id: cartId,
        metadata: shippingAddress
    });
    // console.log(session);
    
    return res.status(200).json({ message: 'Checkout session created successfully', url: session.url });
}

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

export const getOrders = async (req, res, next) => {
    const user = req.user._id;
    const orders = await Order.find({ user })
    .populate('user', 'firstName lastName email')
    .populate('products.product', 'coverImage name price');

    if(orders.length === 0){
        return next(new AppError('Orders not found', 404));
    }
    res.status(200).json({ message: 'Orders retrieved successfully', orders });
}

export const getAllOrders = async (req, res, next) => {
    const orders = await Order.find({}).populate('user', 'firstName lastName email');
    if(orders.length === 0){
        return next(new AppError('Orders not found', 404));
    }
    res.status(200).json({ message: 'Orders retrieved successfully', orders });
}

export const getOrder = async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id)
    .populate('user', 'firstName lastName email')
    .populate('products.product', 'coverImage name price');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }
    res.status(200).json({ message: 'Order retrieved successfully', order });
}
