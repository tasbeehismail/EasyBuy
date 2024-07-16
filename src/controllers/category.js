import AppError from '../utils/appError.js';
import Category from '../models/category.js';

export const addCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name, slug, image } = req.body;

    const category = await Category.create({
        name,
        slug,
        image,
        createdBy: user_id
    });

    res.status(201).json({ message: 'Category created successfully', data: category });
}


export const updateCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name, slug, image } = req.body;
    const category = await Category.findById({ _id: req.params.id });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }   

    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.image = image || category.image;
    await category.save();

    res.status(200).json({ message: 'Category updated successfully', data: category });
}


export const deleteCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const category = await Category.findById({ _id: req.params.id });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    await category.remove();

    res.status(200).json({ message: 'Category deleted successfully' });
}

export const getCategories = async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({ data: categories });
}

export const getCategory = async (req, res, next) => {
    const category = await Category.findById({ _id: req.params.id });
    res.status(200).json({ data: category });
}