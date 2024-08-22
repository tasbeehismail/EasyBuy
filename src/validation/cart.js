import Joi from 'joi';

const addToCart = Joi.object({
    productId: Joi.string().hex().length(24).required().messages({
        'string.base': 'Product ID must be a string',
        'string.hex': 'Product ID must be a hexadecimal string',
        'string.length': 'Product ID must be 24 characters long',
        'any.required': 'Product ID is required',
    }),
    quantity: Joi.number().min(1).messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be greater than or equal to 1',
        'any.required': 'Quantity is required',
    }),
});

const updateQuantity = Joi.object({
    productId: Joi.string().hex().length(24).required().messages({
        'string.base': 'Product ID must be a string',
        'string.hex': 'Product ID must be a hexadecimal string',
        'string.length': 'Product ID must be 24 characters long',
        'any.required': 'Product ID is required',
    }),
    quantity: Joi.number().min(1).required().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be greater than or equal to 1',
        'any.required': 'Quantity is required',
    }),
});

const applyCoupon = Joi.object({
    coupon: Joi.string().required().messages({
        'string.base': 'Coupon must be a string',
        'any.required': 'Coupon is required',
    }),
})

export { addToCart, updateQuantity, applyCoupon }