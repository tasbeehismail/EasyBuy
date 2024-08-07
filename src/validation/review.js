import Joi from 'joi';

const addReview = Joi.object({
    rating: Joi.number().min(0).max(5).required().messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be greater than or equal to 1',
        'number.max': 'Rating must be less than or equal to 5',
        'any.required': 'Rating is required',
    }),
    comment: Joi.string().max(500).messages({
        'string.base': 'Comment must be a string',
        'string.max': 'Comment must be at most 500 characters',
    }),
    product: Joi.string().hex().length(24).required().messages({
        'string.base': 'Product ID must be a string',
        'string.hex': 'Product ID must be a hexadecimal string',
        'string.length': 'Product ID must be 24 characters long',
        'any.required': 'Product ID is required',
    }),
});

const updateReview = Joi.object({
    rating: Joi.number().min(0).max(5).messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be greater than or equal to 1',
        'number.max': 'Rating must be less than or equal to 5',
    }),
    comment: Joi.string().max(500).messages({
        'string.base': 'Comment must be a string',
        'string.max': 'Comment must be at most 500 characters',
    }),
    id: Joi.string().hex().length(24).messages({
        'string.base': 'ID must be a string',
        'string.hex': 'ID must be a hexadecimal string',
        'string.length': 'ID must be 24 characters long',
    }),
})
export {
    addReview,
    updateReview
}