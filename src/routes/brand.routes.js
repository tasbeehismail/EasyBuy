import { Router } from "express";
import * as brandController from '../controllers/brand.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/brand.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadSingleFile } from '../middleware/uploadFiles.js';
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

router.post('/', 
    verifyToken(),
    authorizeRoles('admin'),
    validate(schema.addBrand),
    uploadSingleFile('logo'),
    asyncHandler(brandController.addBrand)
)

router.get('/', 
    asyncHandler(brandController.getBrands)
)

router.get('/:id',
    asyncHandler(brandController.getBrand)
)

router.patch('/:id',
    verifyToken(),
    authorizeRoles('admin'),
    validate(schema.updateBrand),
    uploadSingleFile('logo'),
    asyncHandler(brandController.updateBrand)
)

router.delete('/:id', 
  verifyToken(),
  authorizeRoles('admin'),
  asyncHandler(brandController.deleteBrand)
);

export default router;
