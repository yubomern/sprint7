const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Configure multer storage (keeps original name but prefixes with timestamp to avoid collisions)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        // sanitize filename (basic)
        const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, `${timestamp}-${safeName}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        // accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static (if you put index.html in public/)
app.use('/', express.static(path.join(__dirname, 'public')));

// Serve uploads statically so each file has a URL: /uploads/<filename>
app.use('/uploads', express.static(UPLOAD_DIR));

// Endpoint: upload single image (field name: image)
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Optionally: save metadata to DB. For demo we just return the file info.
        return res.json({
            success: true,
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: fileUrl,
            },
        });
    } catch (err) {
        console.error('Upload error', err);
        return res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// Endpoint: list uploaded images by scanning upload dir (simple demo)
app.get('/api/images', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.status(500).json({ success: false, message: 'Could not list uploads' });

        // Only include common image extensions (safety)
        const images = files
            .filter((f) => /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(f))
            .map((filename) => ({
                filename,
                url: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
            }));

        res.json({ success: true, data: images });
    });
});

// Run server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Uploads folder: ${UPLOAD_DIR}`);
});
