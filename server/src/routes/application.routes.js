const router = require("express").Router();
const {
  applyToJob,
  getApplicationsForRecruiter,
} = require("../controllers/application.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

/**
 * ================= CANDIDATE =================
 */

// Apply to a job
router.post(
  "/:jobId/apply",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  applyToJob
);

/**
 * ================= RECRUITER =================
 */

// View applications for my jobs
router.get(
  "/recruiter",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  getApplicationsForRecruiter
);

module.exports = router;
