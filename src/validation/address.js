import Joi from 'joi';

const addAddress = Joi.object({
    street: Joi.string().required().messages({
        'string.base': 'Street must be a string',
        'string.empty': 'Street is required',
    }), 
    city: Joi.string().required().messages({
        'string.base': 'City must be a string',
        'string.empty': 'City is required',
    }),
    zip: Joi.string().messages({
        'string.base': 'ZIP code must be a string',
        'string.empty': 'ZIP code is required',
    }),
    country: Joi.string().required().messages({
        'string.base': 'Country must be a string',
        'string.empty': 'Country is required',
    }),
});

const updateAddress = Joi.object({
    id: Joi.string().hex().length(24).messages({
        'string.base': 'ID must be a string',
        'string.hex': 'ID must be a hexadecimal string',
        'string.length': 'ID must be 24 characters long',
    }),
    street: Joi.string().messages({ 
        'string.base': 'Street must be a string',
    }),
    city: Joi.string().messages({ 
        'string.base': 'City must be a string',
    }),
    zip: Joi.string().messages({ 
        'string.base': 'ZIP code must be a string',
    }),
    country: Joi.string().messages({ 
        'string.base': 'Country must be a string',
    }),
});

export { addAddress, updateAddress }