import { Router } from "express";
import * as orderController from '../controllers/order.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/order.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

// create checkout session
router.post('/session/:cartId',
    verifyToken(),
    authorizeRoles('user'),
    asyncHandler(orderController.createCheckoutSession)
)

// create cash order
router.post('/cash/:cartId', 
    verifyToken(),
    authorizeRoles('user'),
    validate(schema.createCashOrder),
    asyncHandler(orderController.createCashOrder)
)

// get user orders
router.get('/', 
    verifyToken(),
    authorizeRoles('user'),
    asyncHandler(orderController.getOrders)
)

// get all orders
router.get('/all', 
    verifyToken(),
    authorizeRoles('admin'),
    asyncHandler(orderController.getAllOrders)
)

// get order
router.get('/:id', 
    verifyToken(),
    authorizeRoles('user'),
    asyncHandler(orderController.getOrder)
)

export default router;