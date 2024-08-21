import { Router } from "express";
import * as addressController from '../controllers/address.js';
import asyncHandler from '../utils/asyncHandler.js';
import { isValidId } from "../validation/idValidation.js";
import { verifyToken } from "../services/auth.service.js";
import { validate } from "../services/validator.service.js";
import * as addressSchema from "../validation/address.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

// add address
router.patch('/', 
    verifyToken(),
    authorizeRoles('user'),
    validate(addressSchema.addAddress),
    asyncHandler(addressController.addAddress)
);

// get addresses of user
router.get('/', 
    verifyToken(),
    authorizeRoles('user'),
    asyncHandler(addressController.getAddresses)
);

// remove address
router.delete('/:id', 
    verifyToken(),
    authorizeRoles('user', 'admin'), 
    isValidId(),
    asyncHandler(addressController.removeAddress)
);

// update address
router.put('/:id', 
    verifyToken(),
    authorizeRoles('user'),
    validate(addressSchema.updateAddress),
    asyncHandler(addressController.updateAddress)
);

export default router