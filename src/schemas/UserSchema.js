const { Joi, celebrate, Segments } = require('celebrate')

const { PagingBaseSchema } = require('./BaseSchema')

const searchUserParamsSchema = PagingBaseSchema.keys({
    userId: Joi.string().allow("").max(50).optional(),
    roleId: Joi.string().allow("").max(50).optional(),
    nip: Joi.string().allow("").max(50).optional(),
    name: Joi.string().allow("").max(50).optional(),
    email: Joi.string().allow("").max(100).optional(),
    phone: Joi.string().allow("").max(100).optional(),
}).unknown(false)

const createUserParamSchema = Joi.object().keys({
    roleId: Joi.string().max(50).required(),
    nip: Joi.string().max(50).required(),
    name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    phone: Joi.string().max(100).required(),
    password: Joi.string().min(4).required(),
}).unknown(false)

const updateUserParamSchema = Joi.object().keys({
    userId: Joi.string().max(50).required(),
    roleId: Joi.string().max(50).required(),
    name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    phone: Joi.string().max(100).required(),
    password: Joi.string().allow("").optional(),
}).unknown(false)

const deleteUserParamSchema = Joi.object().keys({
    userId: Joi.string().max(50).required(),
}).unknown(false)

module.exports = { searchUserParamsSchema, createUserParamSchema, updateUserParamSchema, deleteUserParamSchema}