const router = require("express").Router();
const {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

/**
 * ================= RECRUITER ROUTES =================
 */

// Create Job
router.post(
  "/",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  createJob
);

// Get My Jobs
router.get(
  "/my-jobs",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  getMyJobs
);

// Update Job
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  updateJob
);

// Delete Job
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  deleteJob
);

module.exports = router;
