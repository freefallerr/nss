// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
// Use process.env.PORT for Azure deployment, fallback to 3000 for local development
const port = process.env.PORT || 3000;

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Files will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Use the original filename with a timestamp to avoid overwriting
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload middleware
const upload = multer({ storage: storage });

// Serve static files (e.g., the HTML form) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for file upload
app.post('/upload', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        // If no file is uploaded, send a 400 Bad Request response
        return res.status(400).send('No file uploaded.');
    }
    // Respond with a success message including the uploaded filename
    res.send(`File uploaded successfully: ${req.file.filename}`);
});

// Serve the upload form (index.html) when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Uploads will be saved to: ${uploadDir}`);
});
