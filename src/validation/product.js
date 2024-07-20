import Joi from 'joi';

const fileSchema = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().max(2 * 1024 * 1024).required() // Max size 2MB
}).unknown(true); // Allow other fields that are not explicitly specified

const addProduct = Joi.object({
    title: Joi.string().min(2).max(50).required().messages({
        'string.base': 'Title must be a string',
        'string.min': 'Title must be at least 2 characters',
        'string.max': 'Title must be at most 50 characters',
        'any.required': 'Title is required',
    }),
    description: Joi.string().min(2).max(500).required().messages({
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 2 characters',
        'string.max': 'Description must be at most 500 characters',
        'any.required': 'Description is required',
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be greater than or equal to 0',
        'any.required': 'Price is required',
    }),
    category: Joi.string().hex().length(24).required().messages({
        'string.base': 'Category must be a string',
        'string.hex': 'Category must be a hexadecimal string',
        'string.length': 'Category must be 24 characters long',
        'any.required': 'Category is required',
    }),
    subCategory: Joi.string().hex().length(24).messages({
        'string.base': 'Sub-Category must be a string',
        'string.hex': 'Sub-Category must be a hexadecimal string',
        'string.length': 'Sub-Category must be 24 characters long',
    }),
    brand: Joi.string().hex().length(24).required().messages({
        'string.base': 'Brand must be a string',
        'string.hex': 'Brand must be a hexadecimal string',
        'string.length': 'Brand must be 24 characters long',
        'any.required': 'Brand is required',
    }),
    stock: Joi.number().min(0).required().messages({
        'number.base': 'Stock must be a number',
        'number.min': 'Stock must be greater than or equal to 0',
        'any.required': 'Stock is required',
    }),
    discount: Joi.number().min(0).max(100).messages({
        'number.base': 'Discount must be a number',
        'number.min': 'Discount must be greater than or equal to 0',
        'number.max': 'Discount must be less than or equal to 100',
    }),
    coverImage: Joi.array().items(fileSchema).length(1).required().messages({
        'any.required': 'Cover image is required',
        'array.base': 'Cover image must be an array',
        'array.length': 'Cover image must contain exactly one file',
    }),
    images: Joi.array().items(fileSchema).messages({
        'array.base': 'Images must be an array',
        'any.required': 'Images are required',
    }),
});

const updateProduct = Joi.object({
    id: Joi.string().hex().length(24).messages({
        'string.base': 'ID must be a string',
        'string.hex': 'ID must be a hexadecimal string',
        'string.length': 'ID must be 24 characters long',
    }),
    title: Joi.string().min(2).max(50).messages({
        'string.base': 'Title must be a string',
        'string.min': 'Title must be at least 2 characters',
        'string.max': 'Title must be at most 50 characters',
    }),
    description: Joi.string().min(2).max(500).messages({
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 2 characters',
        'string.max': 'Description must be at most 500 characters',
    }),
    price: Joi.number().min(0).messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be greater than or equal to 0',
    }),
    coverImage: Joi.array().items(fileSchema).length(1).messages({
        'array.base': 'Cover image must be an array',
        'array.length': 'Cover image must contain exactly one file',
    }),
    images: Joi.array().items(fileSchema).messages({
        'array.base': 'Images must be an array',
    }),
    category: Joi.string().hex().length(24).messages({
        'string.base': 'Category must be a string',
        'string.hex': 'Category must be a hexadecimal string',
        'string.length': 'Category must be 24 characters long',
    }),
    subCategory: Joi.string().hex().length(24).messages({
        'string.base': 'Sub-Category must be a string',
        'string.hex': 'Sub-Category must be a hexadecimal string',
        'string.length': 'Sub-Category must be 24 characters long',
    }),
    brand: Joi.string().hex().length(24).messages({
        'string.base': 'Brand must be a string',
        'string.hex': 'Brand must be a hexadecimal string',
        'string.length': 'Brand must be 24 characters long',
    }),
    stock: Joi.number().min(0).messages({
        'number.base': 'Stock must be a number',
        'number.min': 'Stock must be greater than or equal to 0',
    }),
    discount: Joi.number().min(0).max(100).messages({
        'number.base': 'Discount must be a number',
        'number.min': 'Discount must be greater than or equal to 0',
        'number.max': 'Discount must be less than or equal to 100',
    }),
    ratings: Joi.number().min(0).max(5).messages({
        'number.base': 'Ratings must be a number',
        'number.min': 'Ratings must be greater than or equal to 0',
        'number.max': 'Ratings must be less than or equal to 5',
    }),
    numRatings: Joi.number().min(0).messages({
        'number.base': 'NumRatings must be a number',
        'number.min': 'NumRatings must be greater than or equal to 0',
    }),
});

export { addProduct, updateProduct };
