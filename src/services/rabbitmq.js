const amqp = require('amqplib');
const logger = require('../utils/LoggerUtil')

let connection;
let channel;

async function initRabbitMQ(queueName) {
    try {
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        
        await channel.assertQueue(queueName, { durable: true });
        console.log('Connected to RabbitMQ successfully');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

async function sendToQueue(queueName, message) {
    try {
        if (!channel) throw new Error("RabbitMQ channel is not initialized");

        await channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message sent to queue ${queueName}: ${message}`);
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
    }
}

async function consumeMessages(queueName) {
    try {
        if (!channel) throw new Error("RabbitMQ channel is not initialized");

        let messages = [];
        let msg;

        do {
            msg = await channel.get(queueName, { noAck: false });
            if (msg) {
                const messageContent = msg.content.toString();
                messages.push(JSON.parse(messageContent));
                
                channel.ack(msg);
            }
        } while (msg);

        console.log("🚀 ~ consumeMessages ~ messages:", messages)
        return messages; 
    } catch (error) {
        console.error('Error consuming messages:', error);
        throw error;
    }
}

// Close RabbitMQ connection (optional for cleanup)
async function closeRabbitMQ() {
    await channel.close();
    await connection.close();
    logger.info(`Connection RabbitMQ Closed`);
}

module.exports = {
    initRabbitMQ,
    sendToQueue,
    closeRabbitMQ,
    consumeMessages
};
