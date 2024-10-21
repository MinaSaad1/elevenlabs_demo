const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

app.post('/api/clone-voice', upload.array('files'), async (req, res) => {
  try {
    const { name } = req.body;
    const files = req.files;

    console.log('Received request to clone voice:', { name, filesCount: files?.length });

    if (!name || !files || files.length === 0) {
      console.error('Missing required data:', { name, filesCount: files?.length });
      return res.status(400).json({ error: 'Missing required data: name and audio files' });
    }

    if (!ELEVENLABS_API_KEY) {
      console.error('Missing API key');
      return res.status(500).json({ error: 'Server configuration error: Missing API key' });
    }

    const formData = new FormData();
    formData.append('name', name);
    files.forEach((file) => {
      formData.append('files', file.buffer, file.originalname);
    });

    console.log('Sending request to ElevenLabs API');
    const response = await axios.post('https://api.elevenlabs.io/v1/voices/add', formData, {
      headers: {
        ...formData.getHeaders(),
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    console.log('Received response from ElevenLabs API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error cloning voice:', error);
    if (error.response) {
      console.error('ElevenLabs API error response:', error.response.data);
      res.status(error.response.status).json({
        error: 'Failed to clone voice',
        details: error.response.data.detail || error.response.data,
      });
    } else if (error.request) {
      console.error('No response received from ElevenLabs API');
      res.status(500).json({
        error: 'Failed to clone voice',
        details: 'No response received from the voice cloning service',
      });
    } else {
      console.error('Error setting up the request:', error.message);
      res.status(500).json({
        error: 'Failed to clone voice',
        details: 'An unexpected error occurred',
      });
    }
  }
});

// ... (rest of the code remains the same)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('ELEVENLABS_API_KEY:', ELEVENLABS_API_KEY ? 'Set' : 'Not set');
});