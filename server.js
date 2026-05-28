import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/analyze', async (req, res) => {
  try {
    const userMessage = req.body?.messages?.[0]?.content;
    if (!userMessage) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a resume screening AI. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Groq API error:", errorText);
      return res.status(500).json({ error: "Groq API failed" });
    }

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || '';
    res.json({ content: [{ text }] });

  } catch (err) {
    console.error('Server Error:', err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})