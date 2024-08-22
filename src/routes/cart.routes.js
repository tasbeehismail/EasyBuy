import { Router } from "express";
import * as cartController from '../controllers/cart.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/cart.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();
// apply coupon
router.post('/coupon',
    verifyToken(),
    authorizeRoles('user'),
    validate(schema.applyCoupon),
    asyncHandler(cartController.applyCoupon)
)
router.post('/:productId',
    verifyToken(),
    authorizeRoles('user'),
    validate(schema.addToCart),
    asyncHandler(cartController.addToCart)
)

router.get('/',
    verifyToken(),
    authorizeRoles('user'),
    asyncHandler(cartController.getCart)
)

router.patch('/:productId',
    verifyToken(),
    authorizeRoles('user'),
    validate(schema.updateQuantity),
    asyncHandler(cartController.updateQuantity)
)

router.delete('/:productId',
    verifyToken(),
    authorizeRoles('user'),
    asyncHandler(cartController.removeFromCart)
)

router.delete('/',
    verifyToken(),
    authorizeRoles('user'),
    asyncHandler(cartController.clearCart)
)


export default router