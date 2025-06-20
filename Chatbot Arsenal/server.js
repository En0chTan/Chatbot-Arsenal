import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // required for Node versions < 18

dotenv.config();

const apiKey = process.env.API_KEY;
console.log("Loaded API Key:", apiKey); // log early to confirm

const app = express();
app.use(express.json());
app.use(express.static('public')); // serves index.html from /public

app.post('/api/chat', async (req, res) => {
    const { model, messages } = req.body;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model, messages })
        });

        const data = await response.json();
        console.log("💬 OpenRouter API response:", JSON.stringify(data, null, 2)); // ✅ logs full response

        res.json(data);
    } catch (error) {
        console.error("❌ API call failed:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
