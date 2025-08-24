// server.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();

// Enable CORS for frontend requests (adjust origin as needed)
app.use(cors({
    origin: "*",  // your frontend URL
    methods: ["GET", "POST"],
}));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage config to save files in 'uploads' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // Save file with original name and timestamp prefix to avoid overwrites
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

app.use(
    cors({
        // origin: 'http://localhost:5173', // frontend link
        origin: "*",
        credentials: true,
        optionSuccessStatus: 200,
    })
);

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    // Return file path or any info you want to frontend
    res.json({
        message: "File uploaded successfully",
        file: {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
        },
    });
});

// Start server
const PORT = 4002;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
