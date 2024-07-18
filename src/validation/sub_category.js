import Joi from 'joi';
const noMultipleSpaces = /^[^\s]+( [^\s]+)*$/;

const addSubCategory = Joi.object({
  name: Joi.string().min(2).max(50).pattern(noMultipleSpaces).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'string.pattern.base': 'Name must not contain multiple spaces',
    'any.required': 'Name is required',
  }),
  Category: Joi.string().hex().length(24).required().messages({
    'string.base': 'Parent Category must be a string',
    'string.hex': 'Parent Category must be a hexadecimal string',
    'string.length': 'Parent Category must be 24 characters long',
    'any.required': 'Parent Category is required',
  }),
});

const updateSubCategory = Joi.object({
  id: Joi.string().hex().length(24).messages({
    'string.base': 'ID must be a string',
    'string.hex': 'ID must be a hexadecimal string',
    'string.length': 'ID must be 24 characters long',
  }),
  name: Joi.string().min(2).max(50).pattern(noMultipleSpaces).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'string.pattern.base': 'Name must not contain multiple spaces',
  }),
  Category: Joi.string().hex().length(24).messages({
    'string.base': 'Parent Category must be a string',
    'string.hex': 'Parent Category must be a hexadecimal string',
    'string.length': 'Parent Category must be 24 characters long',
    'any.required': 'Parent Category is required',
  }),
});

export  {
  addSubCategory,
  updateSubCategory,
};
