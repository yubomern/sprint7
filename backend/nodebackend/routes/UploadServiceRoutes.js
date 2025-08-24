const express = require("express");
const route = express.Router();
const uploadVideoFile = require("../helpers/uploadVideoFile");
const uploadVideo = require("../helpers/uploadVideo");
const uploadController = require("../controllers/UploadServiceController");

route.post(
    "/api/v4/upload",
    uploadVideoFile,
    uploadVideo,
    uploadController.uploadVideo
);

module.exports = route;
