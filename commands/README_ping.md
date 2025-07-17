# **🏓 `/ping` Command - Bot Latency Checker**

### 📌 Overview
The `/ping` command allows users to check the bot's latency (response time) and the API latency of Discord.

### 🚀 Implementation Details
This command is implemented in `bot.js` (or `commands/ping.js` if using a command handler).  
When a user types `/ping`, the bot responds with:
- **Message Latency** - Time taken for the bot to process the command.
- **API Latency** - Time taken for the bot to communicate with Discord’s API.

### 🛠 Code Implementation

If the bot uses a **single-file structure (`bot.js`)**, add the following:

```javascript
client.on('messageCreate', message => {
    if (message.content === '/ping') {
        const latency = Date.now() - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);
        message.channel.send(`🏓 Latency: ${latency}ms | API Latency: ${apiLatency}ms`);
    }
});
```

### 📥 How to Use

1.  ```bash 
    node bot.js 
2.  ```bash 
    /ping
3.  ```bash
    🏓 Latency: XXms | API Latency: XXms