import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/analyze', async (req, res) => {
  try {
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
            content: 'You are a resume screening AI. Always respond with valid JSON only. No markdown, no code blocks, no explanation. Just the raw JSON object.'
          },
          {
            role: 'user',
            content: req.body.messages[0].content
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      })
    })

    const data = await response.json()
    console.log('GROQ FULL RESPONSE:', JSON.stringify(data))

    if (data.error) {
      console.log('GROQ ERROR:', data.error)
      return res.status(500).json({ error: data.error.message })
    }

    const text = data.choices?.[0]?.message?.content || ''
    console.log('TEXT EXTRACTED:', text)
    res.json({ content: [{ text: text }] })

  } catch (err) {
    console.error('Server Error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => {
  console.log('Proxy running on resume-screener-ai-production.up.railway.app')
})