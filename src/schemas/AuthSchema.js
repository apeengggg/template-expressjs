const { Joi } = require('celebrate')

const loginSchema = Joi.object().keys({
    email: Joi.string().max(100).required(),
    password: Joi.string().min(4).required(),
}).unknown(false)

module.exports = { loginSchema }