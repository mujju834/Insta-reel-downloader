const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();  // Load .env file

const app = express();
const PORT = 5000;

app.use(express.json());

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/download', async (req, res) => {
    const { url } = req.body;

    // Extract the shortcode from the URL
    const shortcode = url.split('/')[4];

    try {
        const options = {
            method: 'GET',
            url: `https://instagram-scraper-2022.p.rapidapi.com/ig/reel/?shortcode=${shortcode}`,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,  // Use the API key from the .env file
                'x-rapidapi-host': 'instagram-scraper-2022.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);

        if (response.data.video_url) {
            res.json({ downloadUrl: response.data.video_url });
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
    } catch (error) {
        console.error('Error fetching the video:', error);
        res.status(500).json({ error: 'An error occurred while fetching the video' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
