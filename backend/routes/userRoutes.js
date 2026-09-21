const express = require("express");

const {
  getUsers,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// USER MANAGEMENT
// ADMIN ONLY
// ==========================================

// GET all users
router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);

// Change role
router.put(
  "/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

// Activate / deactivate user
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateUserStatus
);

module.exports = router;