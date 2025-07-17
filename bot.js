import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { PineconeClient } from '@pinecone-database/client'; // Example for Pinecone
import { HuggingFaceModel } from '@huggingface/transformers'; // For embedding model (adjust accordingly)

dotenv.config();

const PREFIX = process.env.PREFIX;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Initialize Pinecone Client (or other VectorDBs)
const pinecone = new PineconeClient();
pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
});
const index = pinecone.Index('discord-memory'); // Your index name

// Hugging Face model for text embedding (replace with suitable model if needed)
const embedder = new HuggingFaceModel({
    model: "sentence-transformers/all-MiniLM-L6-v2" // You can use different models
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} 🤖`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // /ping command to check bot latency
    if (message.content === '/ping') {
        const latency = Date.now() - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);
        return message.reply(`🏓 Latency is ${latency}ms. API Latency is ${apiLatency}ms.`);
    }

    if (message.content.startsWith(PREFIX)) {
        const userMessage = message.content.slice(PREFIX.length).trim();

        try {
            // Generate embedding for user message
            const embedding = await embedder.embed(userMessage);

            // Store the message in VectorDB (Pinecone in this case)
            const vector = {
                id: message.id, // Unique ID for the message
                values: embedding,
                metadata: { content: userMessage, author: message.author.username },
            };
            await index.upsert([{ vector }]);

            // Retrieve similar messages from the VectorDB (memory)
            const queryResult = await index.query({
                vector: embedding,
                top_k: 1, // Get the top 1 most relevant past message
                includeMetadata: true
            });

            // If there's a relevant past message, retrieve it
            if (queryResult.matches.length > 0) {
                const pastMessage = queryResult.matches[0].metadata.content;
                message.reply(`I remember you said: "${pastMessage}"`);
            }

            // Your original external request for response
            const response = await axios.post('http://localhost:3000/getmsg', {
                message: userMessage
            });
            const replyText = response.data.generatedMessage.response;
            message.reply(replyText);
        } catch (error) {
            console.error(error);
            message.reply("⚠️ Could not process your message. Try again!");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
