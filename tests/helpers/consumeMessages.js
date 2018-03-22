const config = require('../../config');
module.exports = async(maxCount = 1, channel, parseMessage, queueName = `app_${config.rabbit.serviceName}_test.transaction`) => {
    return new Promise(res  => {
        let messageCount = 1;
        channel.consume(queueName, async (message) => {
            const result = parseMessage(message);
            if (result)
                if (messageCount === maxCount) {
                    await channel.cancel(message.fields.consumerTag);
                    res();
                } else {
                    messageCount++;
                }
        }, {noAck: true});
  });
}
