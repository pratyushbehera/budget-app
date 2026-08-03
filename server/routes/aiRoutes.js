const express = require("express");
const router = express.Router();
const {
  chatStream,
  chatStreamOpenRouter,
} = require("../controllers/chatController");

router.post("/chat/v1", chatStream);
router.post("/chat", chatStreamOpenRouter);

module.exports = router;
