const { Joi } = require('celebrate')

const BaseSchema = Joi.object().keys({
    createdDt: Joi.date().required(),
    createdBy: Joi.string().max(20).required(),
    createdDt: Joi.date().required(),
    createdBy: Joi.string().max(20).required(),
})

const PagingBaseSchema = Joi.object().keys({
    page: Joi.number().integer().min(1).required(),
    perPage: Joi.number().integer().min(1).required(),
    orderBy: Joi.string().allow("").required(),
    dir: Joi.string().allow("").required()
})

module.exports = { BaseSchema, PagingBaseSchema }