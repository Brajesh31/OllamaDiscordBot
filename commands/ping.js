// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    execute(message, args) {
        const latency = Date.now() - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);
        message.channel.send(`🏓 Latency is ${latency}ms. API Latency is ${apiLatency}ms.`);
    },
};
