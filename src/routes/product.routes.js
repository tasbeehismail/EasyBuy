import { Router } from "express";
import * as productController from '../controllers/product.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/product.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadMixOfFiles } from '../services/upload.service.js';
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { isValidId } from "../validation/idValidation.js";
import { existingDocument } from "../middleware/existingDocument.js";
import reviewRoutes from "./review.routes.js";

const router = Router();
router.use('/:productId/reviews', reviewRoutes);

// Define the fields for multer to handle
const uploadFieldsConfig = [
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 8 }
];

router.post('/',
    verifyToken(),
    authorizeRoles('admin'),
    uploadMixOfFiles(uploadFieldsConfig),  // Use uploadMixOfFiles for multiple fields
    validate(schema.addProduct),
    asyncHandler(existingDocument('Product', ['title', 'brand'], 'and')),
    asyncHandler(productController.addProduct)
);

router.get('/', 
    asyncHandler(productController.getProducts)
)

router.get('/:id',
    isValidId(),
    asyncHandler(productController.getProduct)
)

router.patch('/:id', 
    verifyToken(),
    authorizeRoles('admin'),
    uploadMixOfFiles(uploadFieldsConfig),
    validate(schema.updateProduct),
    asyncHandler(existingDocument('Product', ['slug', 'brand'], 'and')),
    asyncHandler(productController.updateProduct)
)

router.delete('/:id', 
    verifyToken(),
    authorizeRoles('admin'),
    isValidId(),
    asyncHandler(productController.deleteProduct)
)

export default router;