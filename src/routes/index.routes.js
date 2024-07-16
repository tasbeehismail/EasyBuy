import { Router } from "express";
import userRouter from './user.routes.js';
import AppError from "../utils/appError.js";
import categoryRouter from './category.routes.js'
import subCategoryRouter from './sub_category.routes.js'
import brandRouter from './brand.routes.js'

const app = Router();

app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/sub-category', subCategoryRouter);
app.use('/brand', brandRouter);

app.use('*', (req, res, next) => {
    next (new AppError ('invalid routing path ' + req.originalUrl, 404)); 
});

export default app;