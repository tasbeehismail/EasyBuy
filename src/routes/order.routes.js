import { Router } from "express";
import * as orderController from '../controllers/order.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/order.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

// create cash order
router.post('/cash/:cartId', 
    verifyToken(),
    authorizeRoles('user'),
    validate(schema.createCashOrder),
    asyncHandler(orderController.createCashOrder)
)


export default router;