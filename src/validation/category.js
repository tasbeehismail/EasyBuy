import Joi from 'joi';

const addCategory = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  slug: Joi.string().required().messages({
    'string.base': 'Slug must be a string',
    'any.required': 'Slug is required',
  }),
  image: Joi.string().uri().required().messages({
    'string.base': 'Image must be a string',
    'string.uri': 'Image must be a valid URI',
    'any.required': 'Image is required',
  }),
});

const updateCategory = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
  }),
  slug: Joi.string().messages({
    'string.base': 'Slug must be a string',
  }),
  image: Joi.string().uri().messages({
    'string.base': 'Image must be a string',
    'string.uri': 'Image must be a valid URI',
  }),
});

export default {addCategory, updateCategory};
