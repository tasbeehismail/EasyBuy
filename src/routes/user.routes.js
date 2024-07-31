import { Router } from "express";
import * as userController from '../controllers/user.js';
import { existingDocument } from "../middleware/existingDocument.js";
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/user.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { isValidId } from "../validation/idValidation.js";

const router = Router();

router.get('/me',  
  verifyToken(),
  asyncHandler(userController.getMe)
);

router.get('/account/:id', 
  isValidId(),
  asyncHandler(userController.getOtherUser)
);

router.patch('/account', 
  verifyToken(),
  validate(schema.updateAccount),
  asyncHandler(existingDocument('User', ['email', 'mobileNumber'])), 
  asyncHandler(userController.updateAccount)
);

router.patch('/password', 
  verifyToken(),
  validate(schema.updatePassword),
  asyncHandler(userController.updatePassword)
);

router.delete('/account', 
  verifyToken(),
  asyncHandler(userController.deleteAccount)
);

export default router;
