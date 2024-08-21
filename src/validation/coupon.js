import Joi from 'joi';

const addCoupon = Joi.object({
    code: Joi.string().required().messages({
        'string.base': 'Code must be a string',
        'string.empty': 'Code is required',
    }),
    discount: Joi.number().required().messages({
        'number.base': 'Discount must be a number',
        'number.empty': 'Discount is required',
    }),
    expiryDate: Joi.date().required().messages({
        'date.base': 'Expiry date must be a date',
        'date.empty': 'Expiry date is required',
    }),
    maxUsageCount: Joi.number().messages({
        'number.base': 'Max usage count must be a number',
    }),
});

const updateCoupon = Joi.object({
    id: Joi.string().hex().max(24).required().messages({
        'string.base': 'ID must be a string',
        'string.empty': 'ID is required',
        'string.hex': 'ID must be a hexadecimal string',
        'string.max': 'ID must be 24 characters long',
    }),
    code: Joi.string().messages({
        'string.base': 'Code must be a string',
    }), 
    discount: Joi.number().messages({
        'number.base': 'Discount must be a number',
    }),
    expiryDate: Joi.date().messages({
        'date.base': 'Expiry date must be a date',
    }),
    maxUsageCount: Joi.number().messages({
        'number.base': 'Max usage count must be a number',
    }),
})

export { addCoupon, updateCoupon }