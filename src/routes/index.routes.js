import { Router } from "express";
import userRouter from './user.routes.js';
import AppError from "../utils/appError.js";
import categoryRouter from './category.routes.js'
import subCategoryRouter from './sub_category.routes.js'
import brandRouter from './brand.routes.js'

const app = Router();

app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/sub-categories', subCategoryRouter);
app.use('/brands', brandRouter);

app.use('*', (req, res, next) => {
    next (new AppError ('invalid routing path ' + req.originalUrl, 404)); 
});

export default app;