const express = require('express');
const cors = require('cors');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
app.use(cors());
app.use(express.json());

const project = 'wortise';
const location = 'us-east4';
const model = 'gemini-2.5-flash';

const vertexAI = new VertexAI({
  project,
  location,
  googleAuthOptions: {
    keyFile: './google-vertex-service-account.json',
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  },
});

const generativeModel = vertexAI.getGenerativeModel({
  model,
  generationConfig: { maxOutputTokens: 256 }
});

app.post('/api/chat-vertex', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Falta el mensaje' });

  console.log('Mensaje recibido del frontend:', message);

  try {
    const chat = generativeModel.startChat();
    const result = await chat.sendMessageStream(message);

    let totalText = '';
    for await (const item of result.stream) {
      console.log('Respuesta cruda de Vertex AI (item):', JSON.stringify(item));
      if (item.candidates && item.candidates[0]?.content?.parts?.[0]?.text) {
        const text = item.candidates[0].content.parts[0].text;
        totalText += text;
        console.log('Texto recibido del modelo:', text);
      }
    }
    if (!totalText) {
      console.log('No se recibió texto del modelo.');
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({ text: totalText });
  } catch (error) {
    console.error('Error en el backend:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend local corriendo en http://localhost:${PORT}`);
});