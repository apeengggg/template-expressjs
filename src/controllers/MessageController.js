const { Ok, InternalServerErr } = require('../utils/ResponseUtil')
const logger = require('../utils/LoggerUtil')
const {sendToQueue, initRabbitMQ, closeRabbitMQ,consumeMessages} = require('../services/rabbitmq')

class MessageController {
    async doSendMessage(req, res){
        const body = req.body

        const to = body.to
        const from = req.app.locals.userId
        const message = body.message

        const data = {from,to,message}

        try{
            await initRabbitMQ(to)
            await sendToQueue(to, JSON.stringify(data))
            await closeRabbitMQ()
            Ok(res, `Success send message to ${to}`)
        }catch(e){
            logger.error('MessageController.doSendMessage', err)
            InternalServerErr(res, "Internal Server Error")
        }
    }

    async doReceiveMMessage(req, res){
        const from = req.app.locals.userId

        try{
            await initRabbitMQ(from)
            const data = await consumeMessages(from)
            await closeRabbitMQ()
            Ok(res, 'Success receive message', data)
        }catch(e){
            logger.error('MessageController.doReceiveMMessage', err)
            InternalServerErr(res, "Internal Server Error")
        }
    }
}

module.exports = MessageController