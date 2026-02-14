const router = require("express").Router();

const {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
} = require("../controllers/admin.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

/**
 * ================= ADMIN ROUTES =================
 */

// View all users
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllUsers
);

// Delete user
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteUser
);

// View all jobs
router.get(
  "/jobs",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllJobs
);

// Delete job
router.delete(
  "/jobs/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteJob
);

// View all applications
router.get(
  "/applications",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllApplications
);

const bcrypt = require("bcrypt");
const prisma = require("../../prisma/client");

// ⚠ TEMPORARY PASSWORD RESET ROUTE
router.get("/reset-passwords", async (req, res) => {
  try {
    const hash = await bcrypt.hash("password123", 10);

    await prisma.user.updateMany({
      where: {
        email: {
          in: ["recruiter1@test.com", "admin@test.com"]
        }
      },
      data: {
        password: hash
      }
    });

    res.json({
      message: "Passwords reset successfully to password123"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reset failed" });
  }
});


module.exports = router;
