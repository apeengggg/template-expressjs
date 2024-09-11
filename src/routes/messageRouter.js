const express = require('express')
const MessageController = require('../controllers/MessageController')

const {JwtFilter} = require('../middleware/RequestFilter')
const ctrl = new MessageController()
const msgRouter = express.Router()

// base route /auth
msgRouter.post('/send', JwtFilter, ctrl.doSendMessage)
msgRouter.get('/receive', JwtFilter, ctrl.doReceiveMMessage)

module.exports = msgRouter