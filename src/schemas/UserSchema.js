const { Joi, celebrate, Segments } = require('celebrate')

const { PagingBaseSchema } = require('./BaseSchema')

const searchUserParamsSchema = PagingBaseSchema.keys({
    userId: Joi.string().allow("").max(50).optional(),
    roleId: Joi.string().allow("").max(50).optional(),
    nip: Joi.string().allow("").max(50).optional(),
    name: Joi.string().allow("").max(50).optional(),
    email: Joi.string().allow("").max(100).optional(),
    phone: Joi.string().allow("").max(100).optional(),
}).unknown(true)

const createUserParamSchema = Joi.object().keys({
    roleId: Joi.string().max(50).required(),
    nip: Joi.string().max(50).required(),
    name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    phone: Joi.string().max(100).required(),
    password: Joi.string().min(4).required(),
}).unknown(true)

module.exports = { searchUserParamsSchema, createUserParamSchema }