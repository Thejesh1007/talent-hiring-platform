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

module.exports = router;
