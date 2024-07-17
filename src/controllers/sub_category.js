import AppError from '../utils/appError.js';
import SubCategory from '../models/subCategory.js';
import slugify from 'slugify'
import Category from '../models/category.js';

export const getSubCategories = async (req, res, next) => {
    const subCategories = await SubCategory.find()
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');;
    res.status(200).json({ data: subCategories });
}

export const getSubCategoriesByCategory = async (req, res, next) => {
    const subCategories = await SubCategory.find({ Category: req.params.id })
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy')
    .populate({ path: 'Category', select: 'name' });

    // Manually remove the image and id fields from the populated Category
    const filteredSubCategories = subCategories.map(subCategory => {
        if (subCategory.Category) {
            subCategory.Category.image = undefined;
        }
        return subCategory;
    });

    res.status(200).json({ data: filteredSubCategories });
}


export const getSubCategory = async (req, res, next) => {
    const subCategory = await SubCategory.findById({ _id: req.params.id })
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');
    if(!subCategory){
        return next(new AppError('Sub-Category not found', 404));
    }
    res.status(200).json({ data: subCategory });
}

export const addSubCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name, Category } = req.body;

    const subCategory = await SubCategory.create({ 
        name, 
        slug: slugify(name), 
        Category,
        createdBy: user_id,
        updatedBy: user_id
    });
    res.status(200).json({ message: 'Sub-Category added successfully', data: subCategory });
}

export const updateSubCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name } = req.body;
    if(name){
        req.body.slug = slugify(name);
    }
    const subCategory = await SubCategory.findById({ _id: req.params.id });

    if (!subCategory) {
        return next(new AppError('Sub-Category not found', 404));
    }

    subCategory.name = name || subCategory.name;
    subCategory.slug = req.body.slug || subCategory.slug;
    subCategory.updatedBy = user_id;
    await subCategory.save();

    res.status(200).json({ message: 'Sub-Category updated successfully', data: subCategory });
}


export const deleteSubCategory = async (req, res, next) => {
    const id = req.params.id;
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
        return next(new AppError('Sub-Category not found', 404));
    }

    await SubCategory.findByIdAndDelete(id);

    res.status(200).json({ message: 'Sub-Category deleted successfully' });
}