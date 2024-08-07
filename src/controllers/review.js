import AppError from '../utils/appError.js';
import Review from '../models/review.js';
import APIFeatures from '../utils/APIFeatures.js';
import Product from '../models/product.js';

export const getReviews = async (req, res, next) => {
    const searchFields = ['user']; 

    const { productId } = req.params;
    const filter = productId ? { product: productId } : {};

    const features = new APIFeatures(Review.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(searchFields)
        .paginate();

    const reviewsList = await features.query;

    if (!reviewsList || reviewsList.length === 0) {
        return next(new AppError('Reviews not found', 404));
    }

    const totalReviews = await Review.countDocuments(filter);
    const totalPages = Math.ceil(totalReviews / (parseInt(req.query.limit) || 10));
    const page = parseInt(req.query.page) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const numOfReviews = reviewsList.length;
    const result = {
        totalReviews,
        metaData: {
            page,
            limit: parseInt(req.query.limit) || 10,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            nextPage,
            previousPage
        },
        numOfReviews,
        reviews: reviewsList
    };
    res.status(200).json({ message: 'Reviews fetched successfully', data: result });
}


export const getReview = async (req, res, next) => {
    const review = await Review.findById({ _id: req.params.id })
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');
    if(!review){
        return next(new AppError('Review not found', 404));
    }
    res.status(200).json({ data: review });
}

export const addReview = async (req, res, next) => {
    const user_id = req.user._id;
    const { comment, rating } = req.body;
    const { product } = req.params;

    const productObj = await Product.findById({ _id: product });
    if (!productObj) {
        return next(new AppError('Product not found', 404));
    }

    const review = await Review.create({ 
        comment,
        product,
        rating,
        user: user_id,
        createdBy: user_id,
        updatedBy: user_id
    });
    res.status(200).json({ message: 'Review added successfully', data: review });
}

export const updateReview = async (req, res, next) => {
    const user_id = req.user._id;
    const { comment, rating } = req.body;
    
    const review = await Review.findById({ _id: req.params.id });

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    review.updatedBy = user_id;
    await review.save();

    res.status(200).json({ message: 'Review updated successfully', data: review });
}


export const deleteReview = async (req, res, next) => {
    const id = req.params.id;
    const review = await Review.findById(id);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    await Review .findByIdAndDelete(id);

    res.status(200).json({ message: 'Review deleted successfully' });
}