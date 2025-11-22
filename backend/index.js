const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const { API_URL } = require('../frontend');

dotenv.config();
const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
}

app.post('/api/chat', async (req, res) => {
  try {
    const userMessages = req.body.messages || [];

    const body = {
      model: MODEL,
      input: userMessages.map(m => ({
        role: m.role,
        content: m.text
      })),
      temperature: 0.4,
      max_output_tokens: 800
    };

    const apiRes = await fetch("https://api.ai.google/v1/generateText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify(body)
    });

    const text = await apiRes.text();
    res.setHeader("Content-Type", "text/plain");
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});async function sendMessage() {
    const userInput = document.getElementById("userInput").value;

    const messageDiv = document.getElementById("chatBox");
    messageDiv.innerHTML += `<p><b>You:</b> ${userInput}</p>`;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: [
                { role: "user", text: userInput }
            ]
        })
    });

    const data = await response.json();
    messageDiv.innerHTML += `<p><b>OpenAI:</b> ${data.reply}</p>`;
}

