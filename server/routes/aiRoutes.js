const express = require("express");
const router = express.Router();
const { chatStream } = require("../controllers/chatController");

router.post("/chat", chatStream);

module.exports = router;
