import { Router } from "express";
import * as couponController from '../controllers/coupon.js';
import asyncHandler from '../utils/asyncHandler.js';
import { isValidId } from "../validation/idValidation.js";
import { verifyToken } from "../services/auth.service.js";
import { validate } from "../services/validator.service.js";
import * as couponSchema from "../validation/coupon.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { existingDocument } from "../middleware/existingDocument.js";

const router = Router();

router.post('/', 
    verifyToken(),
    authorizeRoles('admin'),
    asyncHandler(existingDocument('Coupon', ['code'])),
    validate(couponSchema.addCoupon),
    asyncHandler(couponController.addCoupon)
)

router.get('/', 
    verifyToken(),
    authorizeRoles('admin'),
    asyncHandler(couponController.getCoupons)
)

router.get('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    isValidId(),
    asyncHandler(couponController.getCouponById)
)

router.patch('/:id', 
    verifyToken(),
    authorizeRoles('admin'),
    validate(couponSchema.updateCoupon),
    asyncHandler(existingDocument('Coupon', ['code'])),
    asyncHandler(couponController.updateCoupon)
)

router.delete('/:id', 
    verifyToken(),
    authorizeRoles('admin'),
    isValidId(),
    asyncHandler(couponController.deleteCoupon)
)

export default router