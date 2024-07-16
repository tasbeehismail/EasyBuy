import { Router } from "express";
import * as brandController from '../controllers/brand.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/brand.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";

const router = Router();

router.post('/', 
    verifyToken(),
    validate(schema.addBrand),
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
    validate(schema.updateBrand),
    asyncHandler(brandController.updateBrand)
)

router.delete('/:id', 
  verifyToken(),
  asyncHandler(brandController.deleteBrand)
);

export default router;
