const User = require("../models/User");

// ==========================================
// GET ALL USERS
// ADMIN ONLY
// ==========================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};

// ==========================================
// UPDATE USER ROLE
// ADMIN ONLY
// ==========================================

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "officer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Admin should not accidentally remove their own admin role
    if (req.user.id === id && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    return res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user role",
    });
  }
};

// ==========================================
// UPDATE USER STATUS
// ADMIN ONLY
// ==========================================

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Admin should not deactivate their own account
    if (req.user.id === id && status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = status;

    await user.save();

    return res.json({
      success: true,
      message: "User status updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user status",
    });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  updateUserStatus,
};