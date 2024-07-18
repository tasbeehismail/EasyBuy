import Joi from 'joi';

const addCategory = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
    'string.pattern.base': 'Name must not contain multiple spaces',
  }),
  image: Joi.object({
    fieldname: Joi.string().valid('image').required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().max(2 * 1024 * 1024).required(), // Max size 2MB
    filename: Joi.string().required(),
  }).required().messages({
    'any.required': 'Image is required',
    'object.base': 'Image must be an object',
  }),
});

const updateCategory = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'string.pattern.base': 'Name must not contain multiple spaces',
  }),
  id: Joi.string().hex().length(24).messages({
    'string.base': 'ID must be a string',
    'string.hex': 'ID must be a hexadecimal string',
    'string.length': 'ID must be 24 characters long',
  }),
});

export {addCategory, updateCategory};
