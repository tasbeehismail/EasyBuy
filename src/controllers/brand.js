import AppError from '../utils/appError.js';
import Brand from '../models/brand.js';
import slugify from 'slugify'
import { deleteFileIfExists } from '../utils/fileHelper.js';
import APIFeatures from '../utils/APIFeatures.js';

export const addBrand = async (req, res, next) => {
    const user_id = req.user._id;
    const { name } = req.body;

    // Check if file is uploaded
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }
    const logo = req.file.filename;
    
    const brand = await Brand.create({ 
        name,
        logo,
        slug: slugify(name),
        createdBy: user_id,
        updatedBy: user_id
    });

    res.status(201).json({ message: 'Brand created successfully', data: brand });
}

export const getBrands = async (req, res, next) => {
    const searchFields = ['name']; 
    const features = new APIFeatures(Brand.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(searchFields)
        .paginate();

    const brandsList = await features.query;

    if (!brandsList || brandsList.length === 0) {
        return next(new AppError('Brands not found', 404));
    }

    const totalBrands = await Brand.countDocuments();
    const totalPages = Math.ceil(totalBrands / (parseInt(req.query.limit) || 10));
    const page = parseInt(req.query.page) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const numOfBrands = brandsList.length;
    const result = {
        totalBrands,
        metaData: {
            page,
            limit: parseInt(req.query.limit) || 10,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            nextPage,
            previousPage
        },
        numOfBrands,
        Brands: brandsList
    };

    res.status(200).json({ message: 'Brands retrieved successfully', data: result });
}

export const getBrand = async (req, res, next) => {
    const { id } = req.params;

    const brand = await Brand.findById(id)
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');

    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }

    res.status(200).json({ message: 'Brand retrieved successfully', data: brand });
}

export const updateBrand = async (req, res, next) => {
    const { id } = req.params;
    const { name} = req.body;
    let logo;
    if(req.file){
        logo = req.file.filename;
    }
    
    if(name){
        req.body.slug = slugify(name);
    } 
    const brand = await Brand.findById({_id: id});
    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }

    // Delete the old logo if a new one is uploaded
    if (logo) {
        deleteFileIfExists('brands', brand.logo);
    }

    brand.name = name || brand.name;
    brand.logo = logo || brand.logo;
    brand.slug = req.body.slug || brand.slug;
    brand.updatedBy = req.user._id;
    await brand.save();

    res.status(200).json({ message: 'Brand updated successfully', data: brand });
}

export const deleteBrand = async (req, res, next) => {
    const { id } = req.params;

    const brand = await Brand.findById({_id: id});

    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }

    // Delete the logo file
    deleteFileIfExists('brands', brand.logo);

    await Brand.findByIdAndDelete({_id: id});
    
    res.status(200).json({ message: 'Brand deleted successfully' });
}