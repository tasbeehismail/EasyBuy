import Joi from 'joi';

const addBrand = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
    'string.pattern.base': 'Name must not contain multiple spaces',
  }),
});

const updateBrand = Joi.object({
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

export  {
  addBrand,
  updateBrand,
};
