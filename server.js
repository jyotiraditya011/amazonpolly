const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const path = require("path");

// Configure AWS Polly
const polly = new AWS.Polly({
    region: "ap-south-1",
    accessKeyId: "AKIAQUFLQPM5B5HASO7W",
    secretAccessKey: "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",
});

// Initialize Express App
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Route for Text-to-Speech
app.post("/synthesize", async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).send("Text is required");
    }

    try {
        const params = {
            Text: text,
            OutputFormat: "mp3",
            VoiceId: "Ivy", // Change voice if desired
        };

        const { AudioStream } = await polly.synthesizeSpeech(params).promise();

        res.setHeader("Content-Type", "audio/mpeg");
        res.send(AudioStream);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to generate speech");
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
