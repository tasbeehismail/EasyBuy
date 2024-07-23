import AppError from '../utils/appError.js';
import SubCategory from '../models/subCategory.js';
import slugify from 'slugify'
import Category from '../models/category.js';
import APIFeatures from '../utils/APIFeatures.js';

export const getSubCategories = async (req, res, next) => {
    const { categoryId } = req.params;
    const searchFields = ['name']; 
    
    const features = new APIFeatures(SubCategory.find({ Category: categoryId }), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(searchFields)
        .paginate();

    const subCategoriesList = await features.query;

    if (!subCategoriesList || subCategoriesList.length === 0) {
        return next(new AppError('SubCategories not found', 404));
    }

    const totalSubCategories = await SubCategory.countDocuments({ Category: categoryId });
    const totalPages = Math.ceil(totalSubCategories / (parseInt(req.query.limit) || 10));
    const page = parseInt(req.query.page) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const numOfSubCategories = subCategoriesList.length;
    const result = {
        totalSubCategories,
        metaData: {
            page,
            limit: parseInt(req.query.limit) || 10,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            nextPage,
            previousPage
        },
        numOfSubCategories,
        subCategories: subCategoriesList
    };
    res.status(200).json({ message: 'SubCategories fetched successfully', data: result });
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