const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
const categoryRoutes = require('./routes/categoryRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require("./routes/courseRoutes");
const uploadServiceRoutes = require("./routes/UploadServiceRoutes");
const cors = require("cors");
const ocrRoutes = require("../routes/ocr");

const { fromPath } = require("pdf2pic");
const tesseract = require("node-tesseract-ocr");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Tesseractv1 = require("tesseract.js");

const upload = multer({ dest: "uploads/" });

// Serve static files
//app.use(express.static('public'));


app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({
        // origin: 'http://localhost:5173', // frontend link
        origin: "*",
        credentials: true,
        optionSuccessStatus: 200,
    })
);
// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//uploads 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(uploadServiceRoutes);


// Routes api 
app.use("/api/courses", courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/companies', companyRoutes);
//routes templates
app.use('/users', userRoutes);
app.get('/', (req, res) => res.render('index'));
app.get('/categories', (req, res) => res.render('home'));
app.get('/company', (req, res) => res.render('company'));
app.get('/companyhome', (req, res) => res.render('companyhome'));
app.get('/course', (req, res) => res.render('course'));
app.get("/chat",  (req,res) => res.render('chat'));
app.get("/uploadservice",  (req,res) => res.render('upload'));
app.get("/products",  (req,res) => res.render('courseImage/index'));
app.use("/api/v3/ocr", ocrRoutes);


const ocrConfig = {
    lang: "eng+fra", // for English + French
    oem: 1,
    psm: 3,
};

app.post("/api/ocr/pdf", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdfPath = req.file.path;

    const options = {
        density: 100,
        saveFilename: "page",
        savePath: "./uploads",
        format: "png",
        width: 1200,
        height: 1700,
    };

    const storeAsImage = fromPath(pdfPath, options);

    try {
        // Convert first page only (you can loop pages for multi-page)
        const pageToConvertAsImage = 1;
        const imagePath = await storeAsImage(pageToConvertAsImage);

        // Run OCR on image file
        const text = await tesseract.recognize(imagePath.path, ocrConfig);

        // Delete files after OCR (optional)
        fs.unlinkSync(pdfPath);
        fs.unlinkSync(imagePath.path);

        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
});

// OCR route upload-pdf
app.post("/upload-pdf", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.join(__dirname, req.file.path);

    try {
        // OCR for English + French
        const { data: { text } } = await Tesseractv1.recognize(filePath, "eng+fra", {
            logger: m => console.log(m) // progress logging
        });

        fs.unlinkSync(filePath); // cleanup
        res.json({ text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "OCR failed" });
    }
});
mongoose.connect('mongodb://localhost:27017/lmsuser', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  });
