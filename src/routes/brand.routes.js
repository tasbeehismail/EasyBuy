import { Router } from "express";
import * as brandController from '../controllers/brand.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/brand.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadSingleFile } from '../middleware/uploadFiles.js';
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { isValidId } from "../validation/idValidation.js";

const router = Router();

router.post('/', 
    verifyToken(),
    authorizeRoles('admin'),
    uploadSingleFile('logo'),
    validate(schema.addBrand),
    asyncHandler(brandController.addBrand)
)

router.get('/', 
    asyncHandler(brandController.getBrands)
)

router.get('/:id',
    isValidId(),
    asyncHandler(brandController.getBrand)
)

router.patch('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    uploadSingleFile('logo'),
    validate(schema.updateBrand),
    asyncHandler(brandController.updateBrand)
)

router.delete('/:id', 
    verifyToken(),
    authorizeRoles('admin'),
    isValidId(),
    asyncHandler(brandController.deleteBrand)
);

export default router;
