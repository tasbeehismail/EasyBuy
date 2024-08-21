import { Router } from "express";
import * as wishlistController from '../controllers/wishlist.js';
import asyncHandler from '../utils/asyncHandler.js';
import { isValidId } from "../validation/idValidation.js";
import { verifyToken } from "../services/auth.service.js";

const router = Router();

// add to wishlist
router.patch('/', 
    verifyToken(),
    isValidId(),
    asyncHandler(wishlistController.addToWishlist)
);

// get wishlist
router.get('/', 
    verifyToken(),
    asyncHandler(wishlistController.getWishlist)
);

// remove from wishlist
router.delete('/:id', 
    verifyToken(),
    isValidId(),
    asyncHandler(wishlistController.removeFromWishlist)
);

export default router