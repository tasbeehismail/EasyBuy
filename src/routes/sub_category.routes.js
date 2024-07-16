import { Router } from "express";
import * as subCategoryController from '../controllers/sub_category.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/sub_category.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadSingleFile } from '../middleware/uploadFiles.js';

const router = Router();

router.post('/', 
    verifyToken(),
    validate(schema.addSubCategory),
    uploadSingleFile('image'),
    asyncHandler(subCategoryController.addSubCategory)
)

router.get('/', 
    asyncHandler(subCategoryController.getCategories)
)

router.get('/:id',
    asyncHandler(subCategoryController.getSubCategory)
)

router.patch('/:id',
    verifyToken(),
    validate(schema.updateSubCategory),
    uploadSingleFile('image'),
    asyncHandler(subCategoryController.updateSubCategory)
)

router.delete('/:id',
    verifyToken(),
    asyncHandler(subCategoryController.deleteSubCategory)
)

export default router;
