const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getPlans, savePlans } = require("../controllers/planController");

router.route("/").get(protect, getPlans).post(protect, savePlans);

module.exports = router;
