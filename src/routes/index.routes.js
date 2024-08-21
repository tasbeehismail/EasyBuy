import { Router } from "express";
import userRouter from './user.routes.js';
import AppError from "../utils/appError.js";
import categoryRouter from './category.routes.js'
import subCategoryRouter from './sub_category.routes.js'
import brandRouter from './brand.routes.js'
import productRouter from './product.routes.js'
import authRouter from './auth.routes.js';
import reviewRouter from './review.routes.js'
import wishlistRouter from './wishlist.routes.js'
import addressRouter from './address.routes.js'

const app = Router();

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/sub-categories', subCategoryRouter);
app.use('/brands', brandRouter);
app.use('/products', productRouter);
app.use('/reviews', reviewRouter);
app.use('/wishlists', wishlistRouter);
app.use('/addresses', addressRouter);

app.use('*', (req, res, next) => {
    next (new AppError ('invalid routing path ' + req.originalUrl, 404)); 
});

export default app;