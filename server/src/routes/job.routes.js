const router = require("express").Router();
const {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");


// ================= PUBLIC ROUTES =================

// Get all jobs (public)
router.get("/", async (req, res) => {
  try {
    const jobs = await require("../../prisma/client").job.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});


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
