import { Router } from "express";
import * as reviewController from '../controllers/review.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/review.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { isValidId } from "../validation/idValidation.js";
import { existingDocument } from "../middleware/existingDocument.js";

const router = Router({ mergeParams: true }); 

router.post('/:productId', 
    verifyToken(),
    authorizeRoles('user'),
    validate(schema.addReview),
    asyncHandler(existingDocument('Review', ['user', 'product'], 'and')),
    asyncHandler(reviewController.addReview)
)

router.get('/', 
    isValidId(),
    asyncHandler(reviewController.getReviews)
)

router.get('/:id',
    isValidId(),
    asyncHandler(reviewController.getReview)
)

router.patch('/:id',
    verifyToken(),
    authorizeRoles('user'),
    validate(schema.updateReview),
    asyncHandler(reviewController.updateReview)
)

router.delete('/:id',
    verifyToken(),
    authorizeRoles('user', 'admin'),
    isValidId(),
    asyncHandler(reviewController.deleteReview)
)

export default router;
