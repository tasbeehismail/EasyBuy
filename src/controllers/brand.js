import AppError from '../utils/appError.js';
import Brand from '../models/brand.js';
import slugify from 'slugify'

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
    const brands = await Brand.find()
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');

    res.status(200).json({ message: 'Brands retrieved successfully', data: brands });
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

    await brand.findByIdAndDelete({_id: id});
    
    res.status(200).json({ message: 'Brand deleted successfully' });
}