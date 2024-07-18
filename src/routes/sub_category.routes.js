import { Router } from "express";
import * as subCategoryController from '../controllers/sub_category.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/sub_category.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadSingleFile } from '../middleware/uploadFiles.js';
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { isValidId } from "../validation/idValidation.js";

const router = Router({ mergeParams: true }); // Merge parent route params

router.post('/', 
    verifyToken(),
    authorizeRoles('admin'),
    validate(schema.addSubCategory),
    uploadSingleFile('image'),
    asyncHandler(subCategoryController.addSubCategory)
)

router.get('/', 
    asyncHandler(subCategoryController.getSubCategories)
)

router.get('/:id',
    isValidId(),
    asyncHandler(subCategoryController.getSubCategory)
)

router.patch('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    validate(schema.updateSubCategory),
    uploadSingleFile('image'),
    asyncHandler(subCategoryController.updateSubCategory)
)

router.delete('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    isValidId(),
    asyncHandler(subCategoryController.deleteSubCategory)
)

export default router;
