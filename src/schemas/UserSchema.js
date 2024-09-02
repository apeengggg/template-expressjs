const { Joi } = require('celebrate')

const { PagingBaseSchema } = require('./BaseSchema')

const searchUserParamsSchema = PagingBaseSchema.keys({
    userId: Joi.string().allow("").max(50).optional(),
    roleId: Joi.string().allow("").max(50).optional(),
    nip: Joi.string().allow("").max(50).optional(),
    name: Joi.string().allow("").max(50).optional(),
    email: Joi.string().allow("").max(100).optional(),
    phone: Joi.string().allow("").max(100).optional(),
}).unknown(true)

module.exports = { searchUserParamsSchema }