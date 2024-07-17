import { Router } from "express";
import * as categoryController from '../controllers/category.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/category.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadSingleFile } from '../middleware/uploadFiles.js';
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = Router();

router.post('/', 
    verifyToken(),
    authorizeRoles('admin'),
    uploadSingleFile('image'),
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
    authorizeRoles('admin'),
    validate(schema.updateCategory),
    uploadSingleFile('image'),
    asyncHandler(categoryController.updateCategory)
)

router.delete('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    asyncHandler(categoryController.deleteCategory)
)

export default router;
