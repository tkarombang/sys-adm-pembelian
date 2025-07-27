const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
// eslint-disable-next-line no-undef
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



router.get('/about', (req, res) => {
  res.render('about', { title: 'About Page' })
})

router.use('/chatbot', (req, res, next) => {
  if (req.query.reload === 'true') {
    return next();
  }

  if (!req.header.referer || !req.header.referer.includes('/chatbot')) {
    req.session.chats = [
      { role: 'AI', message: 'Hai! Saya gemini' }
    ]
  }
  next();
})

router.get('/chatbot', (req, res) => {
  if (!req.session.chats || req.session.chats.length === 0) {
    req.session.chats = [
      { role: 'AI', message: 'Hai! Saya Gemini...' }
    ]
  }
  res.render('chatbot', {
    response: 'Chatbot AI',
    title: 'Chatbot',
    chats: req.session.chats
  })
})

router.post('/chatbot', async (req, res) => {
  try {
    if (!req.session.chats || req.session.chats.length === 0) {
      req.session.chats = [];
    }

    req.session.chats.push({
      role: 'user',
      message: req.body.message
    })

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      apiVersion: "v1"
    });

    const result = await model.generateContent({
      contents: [{
        parts: [{ text: req.body.message }]
      }]
    });

    const responseText = result.response.text();
    // res.json({ reply: responseText });
    req.session.chats.push({
      role: 'AI',
      message: responseText
    })
    res.render('chatbot', {
      title: 'Chatbot',
      chats: req.session.chats
    })
    // res.render('chatbot', { response: responseText, title: 'Chatbot' })
  } catch (error) {
    console.error("Error Detail:", error);

    if (!req.session.chats) {
      req.session.chats = [];
    }

    req.session.chats.push({
      role: 'AI',
      message: 'Maaf, Terjadi kesalahan...'
    })
    res.status(500).render('chatbot', {
      error: "Gagal memproses permintaan",
      title: 'Chatbot',
      availableModels: [
        "gemini-1.5-pro-002",
        "gemini-1.5-pro",
        "gemini-1.5-flash-002"
      ]
    });
  }
});

module.exports = router



// if (!userMessage) {
//   return res.status(400).json({ error: "parameter 'message' diperlukan" })
// }

// const dummyResponse = `Kamu Tanya: "${userMessage}", dan ini jawaban dummy-nya.`;
// res.render('chatbot', {
//   response: dummyResponse
// })