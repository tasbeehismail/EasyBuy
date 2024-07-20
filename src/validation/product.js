import joi from 'joi';

const addProduct = joi.object({
    title: joi.string().min(2).max(50).required().messages({
            'string.base': 'Title must be a string',
            'string.min': 'Title must be at least 2 characters',
            'string.max': 'Title must be at most 50 characters',
            'any.required': 'Title is required',
            'string.pattern.base': 'Title must not contain multiple spaces',
        }),
    description: joi.string().min(2).max(500).required().messages({
            'string.base': 'Description must be a string',
            'string.min': 'Description must be at least 2 characters',
            'string.max': 'Description must be at most 500 characters',
            'any.required': 'Description is required',
            'string.pattern.base': 'Description must not contain multiple spaces',
        }),
    price: joi.number().min(0).required().messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price must be greater than or equal to 0',
            'any.required': 'Price is required',
        }),
    coverImage: joi.object({
            fieldname: joi.string().valid('image').required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),    
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().max(2 * 1024 * 1024).required(), // Max size 2MB
            filename: joi.string().required(),
        }).required().messages({
            'any.required': 'Image is required',
            'object.base': 'Image must be an object',
        }),
    images: joi.array().items(joi.object({
            fieldname: joi.string().valid('image').required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),    
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().max(2 * 1024 * 1024).required(), // Max size 2MB
            filename: joi.string().required(),
        })),
    category: joi.string().hex().length(24).required().messages({
            'string.base': 'Category must be a string',
            'string.hex': 'Category must be a hexadecimal string',
            'string.length': 'Category must be 24 characters long',
            'any.required': 'Category is required',
        }),
    subCategory: joi.string().hex().length(24).messages({
            'string.base': 'Sub-Category must be a string',
            'string.hex': 'Sub-Category must be a hexadecimal string',
            'string.length': 'Sub-Category must be 24 characters long',
        }),
    brand: joi.string().hex().length(24).messages({
            'string.base': 'Brand must be a string',
            'string.hex': 'Brand must be a hexadecimal string',
            'string.length': 'Brand must be 24 characters long',
        }),
    stock: joi.number().min(0).required().messages({
            'number.base': 'Stock must be a number',
            'number.min': 'Stock must be greater than or equal to 0',
            'any.required': 'Stock is required',
        }),
    discount: joi.number().min(0).max(100).messages({
            'number.base': 'Discount must be a number',
            'number.min': 'Discount must be greater than or equal to 0',
            'number.max': 'Discount must be less than or equal to 100',
        }),
});


const updateProduct = joi.object({
    title: joi.string().min(2).max(50).messages({
            'string.base': 'Title must be a string',
            'string.min': 'Title must be at least 2 characters',
            'string.max': 'Title must be at most 50 characters',
        }),
    description: joi.string().min(2).max(500).messages({
            'string.base': 'Description must be a string',
            'string.min': 'Description must be at least 2 characters',
            'string.max': 'Description must be at most 500 characters',
        }),
    price: joi.number().min(0).messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price must be greater than or equal to 0',
        }),
    coverImage: joi.object({
            fieldname: joi.string().valid('image').required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),    
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().max(2 * 1024 * 1024).required(), // Max size 2MB
            filename: joi.string().required(),
        }),
    images: joi.array().items(joi.object({
            fieldname: joi.string().valid('image').required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),    
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().max(2 * 1024 * 1024).required(), // Max size 2MB
            filename: joi.string().required(),
        })),
    category: joi.string().hex().length(24).messages({
            'string.base': 'Category must be a string',
            'string.hex': 'Category must be a hexadecimal string',
            'string.length': 'Category must be 24 characters long',
        }),
    subCategory: joi.string().hex().length(24).messages({
            'string.base': 'Sub-Category must be a string',
            'string.hex': 'Sub-Category must be a hexadecimal string',
            'string.length': 'Sub-Category must be 24 characters long',
        }),
    brand: joi.string().hex().length(24).messages({
            'string.base': 'Brand must be a string',
            'string.hex': 'Brand must be a hexadecimal string',
            'string.length': 'Brand must be 24 characters long',
        }),
    stock: joi.number().min(0).messages({
            'number.base': 'Stock must be a number',
            'number.min': 'Stock must be greater than or equal to 0',
        }),
    discount: joi.number().min(0).max(100).messages({
            'number.base': 'Discount must be a number',
            'number.min': 'Discount must be greater than or equal to 0',
            'number.max': 'Discount must be less than or equal to 100',
        }),
    ratings: joi.number().min(0).max(5).messages({
        'number.base': 'Ratings must be a number',
        'number.min': 'Ratings must be greater than or equal to 0',
        'number.max': 'Ratings must be less than or equal to 5',
    }),
    numRatings: joi.number().min(0).messages({
        'number.base': 'NumRatings must be a number',
        'number.min': 'NumRatings must be greater than or equal to 0',
    }),
});


export {addProduct, updateProduct};