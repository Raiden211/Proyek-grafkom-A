const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve index.html file
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        if (err) {
            res.status(500).send('Error loading index.html');
        } else {
            res.status(200).type('text/html').send(data);
        }
    });
});

// Serve other files
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('File not found');
        } else {
            // Set MIME type based on file extension
            const ext = path.extname(filePath);
            let contentType = 'text/plain'; // Default MIME type
            if (ext === '.js') {
                contentType = 'application/javascript';
            } else if (ext === '.gltf') {
                contentType = 'model/gltf+json';
            } // Add more MIME types for other file types if needed

            res.status(200).type(contentType).send(data);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
