import { Router } from "express";
import * as addressController from '../controllers/address.js';
import asyncHandler from '../utils/asyncHandler.js';
import { isValidId } from "../validation/idValidation.js";
import { verifyToken } from "../services/auth.service.js";
import { validate } from "../services/validator.service.js";
import * as addressSchema from "../validation/address.js";

const router = Router();

// add address
router.patch('/', 
    verifyToken(),
    validate(addressSchema.addAddress),
    asyncHandler(addressController.addAddress)
);

// get addresses of user
router.get('/', 
    verifyToken(),
    asyncHandler(addressController.getAddresses)
);

// remove address
router.delete('/:id', 
    verifyToken(),
    isValidId(),
    asyncHandler(addressController.removeAddress)
);

// update address
router.put('/:id', 
    verifyToken(),
    validate(addressSchema.updateAddress),
    asyncHandler(addressController.updateAddress)
);

export default router