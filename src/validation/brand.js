import Joi from 'joi';

const brandSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  logo: Joi.string().uri().required().messages({
    'string.base': 'Logo must be a string',
    'string.uri': 'Logo must be a valid URI',
    'any.required': 'Logo is required',
  }),
});

export default brandSchema;
