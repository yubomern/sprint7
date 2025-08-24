const express = require("express");
const { createModule, addLink } = require("../controllers/courseController");

const router = express.Router();

const { upload } = require("../helper/filehelper");



//POST A NEW single module  || using req u can access data
router.post("/", upload.single("doc"), createModule);

//POST A NEW single module  || using req u can access data
router.post("/addLink", addLink);

module.exports = router;
