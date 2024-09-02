const { Joi } = require('celebrate')

const loginSchema = Joi.object().keys({
    userId: Joi.string().max(20).required(),
    password: Joi.string().min(4).required(),
}).unknown(true)

module.exports = { loginSchema }