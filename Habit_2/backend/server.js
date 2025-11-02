import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { message, tasks } = req.body;

  const prompt = `
  You are Habit, a motivational AI coach that helps users build good routines.
  Current tasks: ${tasks?.length ? tasks.join(", ") : "No tasks yet."}

  User: ${message}
  Habit:
  `;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tinyllama",
        prompt,
        stream: false
      }),
    });

    const data = await response.json();
    res.json({ reply: data.response || "I'm not sure how to respond." });
  } catch (err) {
    console.error("Ollama error:", err);
    res.status(500).json({ reply: "Error connecting to local AI." });
  }
});

app.listen(3000, () => console.log("✅ Habit backend running on http://localhost:3000"));
