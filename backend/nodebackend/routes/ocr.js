const express = require("express");
const multer = require("multer");
const tesseract = require("node-tesseract-ocr");
const path = require("path");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

const config = {
    lang: "eng+fra", // ✅ English + French OCR
    oem: 1,
    psm: 3
};

router.post("/upload", async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" }); // ✅ safety check
    }

    try {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        const text = await tesseract.recognize(filePath, config);
        res.json({ text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "OCR failed" });
    }
});
router.post("/uploadv2", upload.single("file"), async (req, res) => {
    try {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        const text = await tesseract.recognize(filePath, config);
        res.json({ text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "OCR failed" });
    }
});

// OCR endpoint
router.post("/uploadv1", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = path.join("uploads", req.file.filename);

        // Allow client to choose language: 'eng', 'fra', or both
        const lang = req.query.lang || "eng+fra"; // default: English + French

        const config = {
            lang: lang,
            oem: 1,
            psm: 3
        };

        console.log(`📄 OCR started for: ${filePath} with language: ${lang}`);

        const text = await tesseract.recognize(filePath, config);

        console.log("✅ OCR completed");
        res.status(200).json({ text });
    } catch (err) {
        console.error("❌ OCR error:", err);
        res.status(500).json({ error: "OCR failed", details: err.message });
    }
});

module.exports = router;
