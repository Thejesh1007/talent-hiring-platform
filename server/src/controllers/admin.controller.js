const prisma = require("../../prisma/client");

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * Delete any user
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

/**
 * Get all jobs
 */
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        recruiter: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);
  } catch (error) {
    console.error("Admin get jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/**
 * Delete any job
 */
exports.deleteJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    await prisma.job.delete({
      where: { id: jobId },
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Admin delete job error:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

/**
 * Get all applications
 */
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        candidate: {
          select: { id: true, email: true },
        },
        job: {
          select: { id: true, title: true },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    console.error("Admin get applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};
