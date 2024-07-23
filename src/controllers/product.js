import AppError from '../utils/appError.js';
import Product from '../models/product.js';
import slugify from 'slugify'
import { deleteFileIfExists } from '../utils/fileHelper.js';

export const addProduct = async (req, res, next) => {
    const user_id = req.user._id;
    const { title, description, price, discount, category, subCategory, brand, stock } = req.body;

    // Ensure coverImage and images are present in req.files
    if (!req.files.coverImage) {
        return next(new AppError('Cover image is required', 400));
    }

    const coverImage = req.files.coverImage[0];
    const images = req.files.images;


    const coverImageFilename = coverImage.filename;
    const imagesFilenames = images?.map(file => file.filename);

    const product = await Product.create({
        title,
        slug: slugify(title),
        description,
        price,
        discount,
        category,
        subCategory,
        brand,
        stock,
        images: imagesFilenames,
        coverImage: coverImageFilename,
        createdBy: user_id,
        updatedBy: user_id
    });

    res.status(201).json({ message: 'Product created successfully', data: product });
};

export const getProducts = async (req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find() 
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');

    if(!products){
        return next(new AppError('Products not found', 404));
    }
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const numOfProducts = products.length;
    const result = {
        totalProducts,
        metaData: {
            page,
            limit,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            nextPage,
            previousPage
        },
        numOfProducts,
        products: products
    };
    res.status(200).json({ message: 'Products fetched successfully', data: result });
}

export const getProduct = async (req, res, next) => {   
    const product = await Product.findById({ _id: req.params.id })
    .select('-__v -createdAt -updatedAt -createdBy -updatedBy');
    if(!product){
        return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ message: 'Product fetched successfully', data: product });
}

export const updateProduct = async (req, res, next) => {
    const user_id = req.user._id;
    const { title, description, price, discount, category, subCategory, brand, stock } = req.body;

    // Find the product
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Handle cover image
    if (req.files?.coverImage) {
        // Delete old cover image if it exists
        deleteFileIfExists('products', product.coverImage);
        product.coverImage = req.files.coverImage[0].filename;
    }

    // Handle additional images
    if (req.files?.images) {
        // Delete old images
        product.images.forEach(image => deleteFileIfExists('products', image));

        // Update the images array with new filenames
        product.images = req.files.images.map(file => file.filename);
    }

    // Update product details
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discount = discount || product.discount;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;

    // Update slug if title changes
    if (title) {
        product.slug = slugify(title);
    }

    product.updatedBy = user_id;
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', data: product });
};

export const deleteProduct = async (req, res, next) => {
    const product = await Product.findById({ _id: req.params.id });
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Delete the coverImage file
    deleteFileIfExists('products', product.coverImage);
    // Delete images files
    product.images.forEach(image => deleteFileIfExists('products', image));
    // Delete the product
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product deleted successfully' });
}