const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  getMySubscription,
  createCheckoutSession,
  createPortalSession,
} = require("../controllers/subscriptionController");

const router = express.Router();

router.get("/me", protect, authorizeRoles("user"), getMySubscription);
router.post(
  "/create-checkout-session",
  protect,
  authorizeRoles("user"),
  createCheckoutSession
);
router.post(
  "/create-portal-session",
  protect,
  authorizeRoles("user"),
  createPortalSession
);

module.exports = router;