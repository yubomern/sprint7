const express = require("express");



const { getChat } =  require("../controllers/chatController");

const router = express.Router();



//get chat

router.get("/messages", getChat);
module.exports = router;
