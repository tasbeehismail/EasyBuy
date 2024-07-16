import AppError from '../utils/appError.js';
import SubCategory from '../models/subCategory.js';
import slugify from 'slugify'

export const getCategories = async (req, res, next) => {
    const subCategories = await SubCategory.find();
    res.status(200).json({ data: subCategories });
}

export const getSubCategory = async (req, res, next) => {
    const subCategory = await SubCategory.findById({ _id: req.params.id });
    res.status(200).json({ data: subCategory });
}

export const addSubCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name, image } = req.body;

    const subCategory = await SubCategory.create({ name, slug: slugify(name), image, createdBy: user_id });
    res.status(200).json({ message: 'Sub-Category added successfully', data: subCategory });
}

export const updateSubCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name, image } = req.body;
    if(name){
        req.body.slug = slugify(name);
    }
    const subCategory = await SubCategory.findById({ _id: req.params.id });

    if (!subCategory) {
        return next(new AppError('Sub-Category not found', 404));
    }

    subCategory.name = name || subCategory.name;
    subCategory.slug = req.body.slug || subCategory.slug;
    subCategory.image = image || subCategory.image;
    subCategory.updatedBy = user_id;
    await subCategory.save();

    res.status(200).json({ message: 'Sub-Category updated successfully', data: subCategory });
}


export const deleteSubCategory = async (req, res, next) => {
    const subCategory = await SubCategory.findById({ _id: req.params.id });
    if (!subCategory) {
        return next(new AppError('Sub-Category not found', 404));
    }
    await subCategory.remove();
    res.status(200).json({ message: 'Sub-Category deleted successfully' });
}