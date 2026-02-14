const router = require("express").Router();

const {
  applyToJob,
  getApplicationsForRecruiter,
  getMyApplications,
} = require("../controllers/application.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

/**
 * Candidate applies to job
 */
router.post(
  "/:jobId/apply",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  applyToJob
);

/**
 * Candidate views own applications
 */
router.get(
  "/my",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  getMyApplications
);

/**
 * Recruiter views applications for their jobs
 */
router.get(
  "/recruiter",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  getApplicationsForRecruiter
);

module.exports = router;
