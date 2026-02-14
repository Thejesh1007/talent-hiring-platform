const router = require("express").Router();

const {
  applyToJob,
  getApplicationsForRecruiter,
  getMyApplications,
} = require("../controllers/application.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

// Apply
router.post(
  "/:jobId/apply",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  applyToJob
);

// Candidate dashboard
router.get(
  "/my",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  getMyApplications
);

// Recruiter dashboard
router.get(
  "/recruiter",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  getApplicationsForRecruiter
);

module.exports = router;
