import express from "express";
import fetch from "node-fetch"; // use "npm install node-fetch" if not already installed
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tinyllama",
        prompt: message,
      }),
    });

    const data = await response.text(); // Ollama streams data line by line
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error connecting to Ollama");
  }
});

app.listen(5000, () => console.log("✅ Ollama backend running on port 5000"));
