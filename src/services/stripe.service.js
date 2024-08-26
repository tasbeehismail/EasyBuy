import express from 'express';
import Stripe from 'stripe';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/order.js';
import AppError from '../utils/appError.js';
import Cart from '../models/cart.js';

/**
 * Sets up the Stripe webhook endpoint.
 *
 * @param {Object} app - The express app to configure.
 */
const setupWebhook = (app) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    app.post('/v1/api/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
        const sig = req.headers['stripe-signature'].toString();

        let event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        // Handle the event
        let session;
        if (event.type === 'checkout.session.completed') {
            session = event.data.object;
            // find cart by id
            const userCart = await Cart.findById(session.client_reference_id);
            if (!userCart) {
                throw new AppError('Cart not found');
            }
            // create order
            const order = await Order.create({ 
                user: session.client_reference_id, 
                products: userCart.items, 
                total_price: session.amount_total / 100, 
                shippingAddress: session.metadata,
                paymentMethod: 'card', 
                status: 'paid',
            });
            // update stock and sold
            Product.bulkWrite(
                userCart.items.map((item) => {
                    return {
                        updateOne: {
                            filter: { _id: item.product },
                            update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
                        },
                    };
                })
            );
            // delete cart
            await Cart.findByIdAndDelete(session.client_reference_id);
            // update order
            await order.save();
        }

        // Return a 200 response to acknowledge receipt of the event
        res.json({ message: 'Success', data: session });
    }));
};

export default setupWebhook;
