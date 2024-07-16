import AppError from '../utils/appError.js';
import Brand from '../models/brand.js';

export const addBrand = async (req, res, next) => {
    const { name, logo } = req.body;
    const brand = await Brand.create({ name, logo });

    res.status(201).json({ message: 'Brand created successfully', data: brand });
}

export const getBrands = async (req, res, next) => {
    const brands = await Brand.find();
    res.status(200).json({ message: 'Brands retrieved successfully', data: brands });
}

export const getBrand = async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }
    res.status(200).json({ message: 'Brand retrieved successfully', data: brand });
}

export const updateBrand = async (req, res, next) => {
    const { id } = req.params;
    const { name, logo } = req.body;
    const brand = await Brand.findById({_id: id});
    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }

    brand.name = name || brand.name;
    brand.logo = logo || brand.logo;
    await brand.save();
    res.status(200).json({ message: 'Brand updated successfully', data: brand });
}

export const deleteBrand = async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById({_id: id});
    if (!brand) {
        return next(new AppError('Brand not found', 404));
    }
    await brand.remove();
    res.status(200).json({ message: 'Brand deleted successfully' });
}