import { Router } from "express";
import * as categoryController from '../controllers/category.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/category.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadSingleFile } from '../services/upload.service.js';
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import subCategoryRoutes from "./sub_category.routes.js";
import { isValidId } from "../validation/idValidation.js";
import { existingDocument } from "../middleware/existingDocument.js";

const router = Router();

// Nested sub-category routes
router.use('/:categoryId/sub-categories', subCategoryRoutes);

router.post('/', 
    verifyToken(),
    authorizeRoles('admin'),
    asyncHandler(uploadSingleFile('image')),
    validate(schema.addCategory),
    asyncHandler(existingDocument('Category', ['name'])),
    asyncHandler(categoryController.addCategory)
)

router.get('/', 
    asyncHandler(categoryController.getCategories)
)

router.get('/:id',
    isValidId(),
    asyncHandler(categoryController.getCategory)
)

router.patch('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    asyncHandler(uploadSingleFile('image')),
    validate(schema.updateCategory),
    asyncHandler(existingDocument('Category', ['name'])),
    asyncHandler(categoryController.updateCategory)
)

router.delete('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    isValidId(),
    asyncHandler(categoryController.deleteCategory)
)

export default router;
