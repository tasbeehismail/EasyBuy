import AppError from '../utils/appError.js';
import Coupon from '../models/coupon.js';

// add coupon
export const addCoupon = async (req, res, next) => {
    const { code, discount, expiryDate, maxUsageCount } = req.body;
    const coupon = new Coupon({
        code,
        discount,
        expiryDate,
        maxUsageCount,
        createdBy: req.user._id
    });
    await coupon.save();
    res.status(200).json({ message: 'Coupon added successfully', data: coupon });
}

// get all coupons
export const getCoupons = async (req, res, next) => {
    const coupons = await Coupon.find();
    res.status(200).json({ message: 'Coupon fetched successfully', data: coupons });
}

// get specific coupon
export const getCouponById = async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        return next(new AppError('Coupon not found', 404));
    }
    res.status(200).json({ message: 'Coupon fetched successfully', data: coupon });
}

// update coupon
export const updateCoupon = async (req, res, next) => {
    const { code, discount, expiryDate, maxUsageCount } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        return next(new AppError('Coupon not found', 404));
    }
    coupon.code = code || coupon.code;
    coupon.discount = discount || coupon.discount;
    coupon.expiryDate = expiryDate || coupon.expiryDate;
    coupon.maxUsageCount = maxUsageCount || coupon.maxUsageCount;
    await coupon.save();

    res.status(200).json({ message: 'Coupon updated successfully', data: coupon });
}

// delete coupon
export const deleteCoupon = async (req, res, next) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
        return next(new AppError('Coupon not found', 404));
    }
    
    res.status(200).json({ message: 'Coupon deleted successfully' });
}