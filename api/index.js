import express from 'express'
import cors from "cors"
import axios from 'axios'

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Express and Ollama");
});

app.post('/getmsg', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "deepseek-r1:1.5b",
            prompt: message,
            stream: false
        });

        res.status(200).send({
            message: "Message generated successfully",
            generatedMessage: response.data
        });
    } catch (error) {
        console.error("Error generating message:", error);
        res.status(500).send({
            message: "Failed to generate message",
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('App started at port 3000');
});
