const express = require("express");
const route = express.Router();
const uploadVideoFile = require("../middleware/uploadVideoFile");
const uploadVideo = require("../middleware/uploadVideo");
const uploadController = require("../controllers/uploadController");

route.post(
  "/api/v1/upload",
  uploadVideoFile,
  uploadVideo,
  uploadController.uploadVideo
);

module.exports = route;