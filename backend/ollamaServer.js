// ollamaServer.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route that connects to Ollama locally
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        prompt: message,
      }),
    });

    const data = await response.text();

    res.json({
      success: true,
      response: data,
    });
  } catch (error) {
    console.error('Error talking to Ollama:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to communicate with Ollama.',
    });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
