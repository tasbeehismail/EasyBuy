import AppError from '../utils/appError.js';
import Category from '../models/category.js';
import slugify from 'slugify'
import { deleteFileIfExists } from '../utils/fileHelper.js';
import APIFeatures from '../utils/APIFeatures.js';

export const addCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name } = req.body;
    // Check if file is uploaded
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }
    const image = req.file.filename;
    
    const category = await Category.create({
        name,
        slug: slugify(name),
        image,
        createdBy: user_id,
        updatedBy: user_id
    });

    res.status(201).json({ message: 'Category created successfully', data: category });
}


export const updateCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name } = req.body;
    // Check if file is uploaded
    let image;
    if(req.file){
        image = req.file.filename;
    }
    
    if(name){
        req.body.slug = slugify(name);
    }
    const category = await Category.findById({ _id: req.params.id });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }   
    // Delete the old image if a new one is uploaded
    if (image) {
        deleteFileIfExists('categories', category.image);
    }

    category.name = name || category.name;
    category.slug = req.body.slug || category.slug;
    category.image = image || category.image;
    category.updatedBy = user_id;
    await category.save();

    res.status(200).json({ message: 'Category updated successfully', data: category });
}


export const deleteCategory = async (req, res, next) => {
    const category = await Category.findById({ _id: req.params.id });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    // Delete the image file
    deleteFileIfExists('categories', category.image);

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Category deleted successfully' });
}

export const getCategories = async (req, res, next) => {
    const searchFields = ['name']; 
    const features = new APIFeatures(Category.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(searchFields)
        .paginate();

    const categoriesList = await features.query;

    if (!categoriesList || categoriesList.length === 0) {
        return next(new AppError('Categories not found', 404));
    }

    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / (parseInt(req.query.limit) || 10));
    const page = parseInt(req.query.page) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const numOfCategories = categoriesList.length;
    const result = {
        totalCategories,
        metaData: {
            page,
            limit: parseInt(req.query.limit) || 10,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            nextPage,
            previousPage
        },
        numOfCategories,
        categories: categoriesList
    };
    res.status(200).json({ message: 'Categories fetched successfully', data: result });
}

export const getCategory = async (req, res, next) => {
    const category = await Category.findById({ _id: req.params.id })
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');
    if(!category){
        return next(new AppError('Category not found', 404));
    }
    res.status(200).json({ data: category });
}