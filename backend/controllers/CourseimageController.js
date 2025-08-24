const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/courseImage');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('courseImage/index', { products });
});

// Get the form to create a new product
router.get('/new', (req, res) => {
    res.render('courseImage/new');
});

// Create a new product
router.post('/', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'singleImage' }]), async (req, res) => {
    const imagePaths = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const singleImagePath = req.files['singleImage'] ? req.files['singleImage'][0].path : null;

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: imagePaths,
        singleImage: singleImagePath, // Save the single image path
    });

    await product.save();
    res.redirect('/products');
});

// Show a single product
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('courseImage/show', { product });
});

// Get the edit form for a product
router.get('/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('courseImage/edit', { product });
});

// Update a product
router.put('/:id', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'singleImage' }]), async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.description = req.body.description;

    // Add new images if uploaded
    if (req.files['images']) {
        const newImagePaths = req.files['images'].map(file => file.path);
        // product.images = [...product.images, ...newImagePaths]; // Combine existing and new images
        product.images = newImagePaths; // Combine existing and new images
    }

    // Update single image if uploaded
    if (req.files['singleImage']) {
        product.singleImage = req.files['singleImage'][0].path; // Replace with the new single image
    }

    await product.save();
    res.redirect(`/products/${product._id}`);
});


// Delete a product
router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

module.exports = router;