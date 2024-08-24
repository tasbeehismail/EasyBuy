import Joi from 'joi';
const addressSchema = Joi.object({
    street: Joi.string().required().messages({
      'string.base': 'Street must be a string',
      'string.empty': 'Street is required',
    }),
    city: Joi.string().required().messages({
      'string.base': 'City must be a string',
      'string.empty': 'City is required',
    }),
    zip: Joi.string().required().messages({
      'string.base': 'ZIP code must be a string',
      'string.empty': 'ZIP code is required',
    }),
    country: Joi.string().required().messages({
      'string.base': 'Country must be a string',
      'string.empty': 'Country is required',
    }),
  }).required().messages({
    'any.required': 'Shipping address is required',
  });
  
const createCashOrder = Joi.object({
    shippingAddress: addressSchema,
    cartId: Joi.string().hex().length(24).required().messages({
        'string.base': 'Cart ID must be a string',
        'string.hex': 'Cart ID must be a hexadecimal string',
        'string.length': 'Cart ID must be 24 characters long',
    }),

});


export { createCashOrder }