import { Router } from "express";
import * as categoryController from '../controllers/category.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/category.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";

const router = Router();

router.post('/', 
    verifyToken(),
    validate(schema.addCategory),
    asyncHandler(categoryController.addCategory)
)

router.get('/', 
    asyncHandler(categoryController.getCategories)
)

router.get('/:id',
    asyncHandler(categoryController.getCategory)
)

router.patch('/:id',
    verifyToken(),
    validate(schema.updateCategory),
    asyncHandler(categoryController.updateCategory)
)

router.delete('/:id',
    verifyToken(),
    asyncHandler(categoryController.deleteCategory)
)

export default router;
