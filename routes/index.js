const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
// eslint-disable-next-line no-undef
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



router.get('/chatbot', (req, res) => {
  res.render('chatbot', { response: "AI Chatbot" })
})

router.post('/chatbot', async (req, res) => {
  try {
    // Gunakan model yang tersedia (pilih salah satu)
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
    // res.json({ reply: response });
    res.render('chatbot', { response: responseText })
  } catch (error) {
    console.error("Error Detail:", error);
    res.status(500).json({
      error: "Gagal memproses permintaan",
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