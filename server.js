import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// health check (VERY IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.send("Resume Screener API is running 🚀");
});

app.post("/api/analyze", async (req, res) => {
  try {
    const userMessage = req.body?.messages?.[0]?.content;

    if (!userMessage) {
      return res.status(400).json({ error: "Missing resume/job data" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Return ONLY valid JSON. No markdown, no explanation, no code blocks.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.2,
          max_tokens: 1500,
        }),
      }
    );

    // if Groq fails
    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API Error:", errText);
      return res.status(500).json({
        error: "Groq API failed",
        details: errText,
      });
    }

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        error: "Empty response from Groq",
      });
    }

    return res.json({
      content: [{ text }],
    });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});