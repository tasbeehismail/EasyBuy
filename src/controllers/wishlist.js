import AppError from '../utils/appError.js';
import User from '../models/user.js';
import Product from '../models/product.js';

export const addToWishlist = async (req, res, next) => {
    const { product } = req.body;
    
    if(!product) {    
        return next(new AppError('Product ID is required', 400));
    }

    const userId = req.user.id;

    const user = await User.findById(userId);   

    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    if (user.wishlist.includes(product)) {
        return next(new AppError('Product already in wishlist', 400));
    }   

    user.wishlist.push({product: product});
    await user.save();
    res.status(200).json({ message: 'Product added to wishlist successfully' });
}

export const removeFromWishlist = async (req, res, next) => {
    const wishlistId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Find the index of the product in the wishlist
    const wishlistIndex = user.wishlist.findIndex(item => item._id.equals(wishlistId));

    if (wishlistIndex === -1) {
        return next(new AppError('Product not in wishlist', 400));
    }

    // Remove the product from the wishlist
    user.wishlist.splice(wishlistIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
};


export const getWishlist = async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
        path: 'wishlist',
        select: '-__v -updatedAt -createdBy -updatedBy'
    }).exec();

    if (!user) {
        return next(new AppError('User not found', 404));
    }
    //console.log(user);
    let products=[];
    for(let i = 0; i < user.wishlist.length; i++){
        products.push(user.wishlist[i].product);
    }
    console.log(products);
    const wishlist = await Product.find({ _id: {$in: products} }).skipPopulateReviews().exec();
    res.status(200).json({ data: wishlist });
}
