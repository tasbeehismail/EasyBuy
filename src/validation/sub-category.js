import Joi from 'joi';

const subCategorySchema = Joi.object({
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
  Category: Joi.string().required().messages({
    'string.base': 'Parent Category must be a string',
    'any.required': 'Parent Category is required',
  }),
});

export default subCategorySchema;
