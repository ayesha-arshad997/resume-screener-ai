import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.choices?.[0]?.message?.content || '';
    res.json({ content: [{ text }] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}