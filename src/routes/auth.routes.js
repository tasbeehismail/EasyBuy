import { Router } from "express";
import * as authController from '../controllers/auth.js';
import { existingDocument } from "../middleware/existingDocument.js";
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/user.js";
import { validate } from "../services/validator.service.js";

const router = Router();

router.post('/signup', 
  validate(schema.signUp), 
  asyncHandler(existingDocument('User', ['email', 'mobileNumber'])), 
  asyncHandler(authController.signup)
);

router.post('/login', 
  validate(schema.logIn), 
  asyncHandler(authController.login)
);

router.post('/verify-email', 
  validate(schema.verifyEmail),
  asyncHandler(authController.verifyEmail)
);

router.post('/forgot-password', 
  validate(schema.forgetPassword),
  asyncHandler(authController.forgotPassword)
);

router.post('/reset-password', 
  validate(schema.resetPassword), 
  asyncHandler(authController.resetPassword)
);

export default router;
