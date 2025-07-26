const express = require('express');
const router = express.Router();

const { OpenAI } = require('openai');

const openai = new OpenAI({
  // eslint-disable-next-line no-undef
  apiKey: process.env.OPENAI_API_KEY
})

router.get('/chatbot', (req, res) => {
  res.render('chatbot', { response: "AI Chatbot" })
})

router.post('/chatbot', async (req, res) => {
  try {

    const { message } = await req.body;

    if (!message) {
      return res.status(400).json({ error: "Harus Ngomong" });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'System', content: 'Anda  adalah Asisten yang membantu pengguna' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    })
    const aiResponse = completion.choices[0].message.content;
    res.json({ reply: aiResponse })

  } catch (err) {
    console.log("Chatbot error:", err);
    res.status(500).json({
      error: "Terjadi Kesalahan",
      details: err.message
    })
  }
})

module.exports = router



// if (!userMessage) {
//   return res.status(400).json({ error: "parameter 'message' diperlukan" })
// }

// const dummyResponse = `Kamu Tanya: "${userMessage}", dan ini jawaban dummy-nya.`;
// res.render('chatbot', {
//   response: dummyResponse
// })