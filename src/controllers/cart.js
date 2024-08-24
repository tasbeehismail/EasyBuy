import AppError from '../utils/appError.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Coupon from '../models/coupon.js';

export const addToCart = async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const quantity = req.body.quantity || 1;

    const cart = await Cart.findOne({ user: userId });

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    const cartProductQuantity = cart?.items?.find(item => item.product.equals(productId))?.quantity || 0;
    if (product.stock < quantity + cartProductQuantity) {
        return next(new AppError('Product out of stock', 400));
    }

    if (!cart) { 
        // Create a new cart if it doesn't exist
        const newCart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }],
            total: product.price * quantity
        });

        return res.status(201).json({ message: 'Cart created successfully', data: newCart });
    }

    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    
    if (itemIndex > -1) { 
        // Update quantity of an existing product in the cart
        const existingItem = cart.items[itemIndex];
        existingItem.quantity += quantity;

        cart.total += product.price * quantity;

        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully', data: cart });
    }

    // Add new product to the existing cart and update total price
    cart.items.push({ product: productId, quantity });
    cart.total += product.price * quantity;

    await cart.save();

    return res.status(201).json({ message: 'Cart updated successfully', data: cart });
};

export const getCart = async (req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price images');
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    return res.status(200).json({ message: 'Cart retrieved successfully', data: cart });
};

export const updateQuantity = async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');;
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex === -1) {
        return next(new AppError('Product not found in cart', 404));
    }   
    cart.items[itemIndex].quantity = quantity;
    // Loop through cart items and update total price
    cart.total = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    await cart.save();
    cart.items.forEach(item => item.product = item.product._id);

    return res.status(200).json({ message: 'Quantity updated successfully', data: cart });
}

export const removeFromCart = async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex === -1) {
        return next(new AppError('Product not found in cart', 404));
    }

    cart.items.splice(itemIndex, 1);
    cart.total -= cart.items[itemIndex].product.price * cart.items[itemIndex].quantity;
    await cart.save();
    cart.items.forEach(item => item.product = item.product._id);

    return res.status(200).json({ message: 'Product deleted from cart successfully', data: cart });
}

export const clearCart = async (req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();
    cart.items.forEach(item => item.product = item.product._id);

    return res.status(200).json({ message: 'Cart cleared successfully', data: cart });
}

export const applyCoupon = async (req, res, next) => {
    const userId = req.user._id;
    const couponCode = req.body.coupon;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
        return next(new AppError('Coupon not found', 404));
    }
    coupon.usedCount += 1;
    await coupon.save();

    // Apply the coupon discount
    const discountAmount = (cart.total * coupon.discount) / 100;
    const totalPriceAfterDiscount = cart.total - discountAmount;

    // Prepare the result to be sent back to the user
    const result = {
        totalPriceBeforeDiscount: cart.total,
        discount: coupon.discount,
        totalPriceAfterDiscount
    };

    // Update the cart with the new total price
    cart.total = totalPriceAfterDiscount;
    await cart.save();

    return res.status(200).json({ message: 'Coupon applied successfully', data: result });
}